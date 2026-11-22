// 안드로이드 maskable 아이콘을 다시 만드는 스크립트.
// `npm run generate-pwa-assets`가 아이콘을 만든 직후 자동으로 실행된다. (package.json 참고)
//
// 왜 필요한가?
//   maskable 아이콘은 폰마다 원, 둥근 사각형 등 다른 모양으로 잘린다.
//   가장 작게 자르는 폰은 가운데 지름 80% 원(안전 영역)만 남긴다.
//   원본(app-icon.png)은 흰 문서 그림이 크게 꽉 차 있어서, 그대로 쓰면 그 폰에서는 원 전체가 흰색으로 덮인다.
//   그렇다고 생성기의 padding을 쓰면 여백이 단색으로 채워져 그라데이션 배경과 색이 어긋난 띠가 생긴다.
//
// 그래서: 원본에서 "흰 그림"만 뽑아 작게 줄이고, 원본과 같은 그라데이션 배경을 새로 그려 그 위에 올린다.
//   (비행기는 흰 문서에 뚫린 구멍이라, 흰 그림만 옮기면 구멍으로 새 배경이 그대로 비친다)
import sharp from 'sharp'

const SOURCE = 'public/app-icon.png'
const OUTPUT = 'public/maskable-icon-512x512.png'
const SIZE = 512
const SCALE = 0.86 // 흰 그림의 크기 비율. 가장 먼 모서리(중심에서 원본 크기의 약 41%)가 줄어든 뒤 안전 영역(반지름 40%) 안에 들어오도록 정한 값
// 원본 그라데이션의 위쪽, 아래쪽 색 (원본 픽셀에서 직접 읽은 값)
const TOP_COLOR = '#2c4388'
const BOTTOM_COLOR = '#1a2b5f'

// 1) 흰 그림의 모양(투명도)을 뽑는다: 밝을수록 불투명하게.
//    가장자리의 부드러운 경계(안티에일리어싱)도 그대로 살리기 위해 밝기를 0~255 범위로 늘려 쓴다.
const artSize = Math.round(SIZE * SCALE)
const { data, info } = await sharp(SOURCE)
  .resize(artSize, artSize)
  .removeAlpha()
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true })
const BG_LUMA = 90 // 배경 남색의 밝기는 46~71 (원본에서 측정). 이보다 넉넉히 높게 잡아 배경이 조금도 섞이지 않게 한다
const alpha = Buffer.from(
  data.map((v) => Math.max(0, Math.min(255, ((v - BG_LUMA) * 255) / (255 - BG_LUMA)))),
)
const whiteArt = await sharp({
  create: { width: artSize, height: artSize, channels: 3, background: '#ffffff' },
})
  .joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  .png()
  .toBuffer()

// 2) 원본과 같은 세로 그라데이션 배경을 그리고, 가운데에 흰 그림을 올린다.
const background = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${TOP_COLOR}"/><stop offset="1" stop-color="${BOTTOM_COLOR}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`,
)
const offset = Math.round((SIZE - artSize) / 2)
await sharp(background)
  .composite([{ input: whiteArt, left: offset, top: offset }])
  .png()
  .toFile(OUTPUT)

console.log(`✔ maskable 아이콘 재생성: ${OUTPUT} (그림 크기 ${SCALE * 100}%)`)
