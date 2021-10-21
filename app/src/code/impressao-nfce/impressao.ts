import { connectToPrinter, TPrintCanvas } from 'browser-thermal-printer-encoder'
import { getConfiguracoes } from './configuracao'

let printCanvas: TPrintCanvas

export async function imprimirCanvas(canvas: HTMLCanvasElement) {
  if (!printCanvas) printCanvas = await connectToPrinter()
  const configs = getConfiguracoes()
  const pulse =
    configs.pinoPulso === -1
      ? undefined
      : {
          devicePin: configs.pinoPulso,
          on: configs.onPulso,
          off: configs.offPulso,
        }
  await printCanvas({
    canvas,
    imageMode: configs.formato,
    paddingTop: configs.superior,
    paddingBottom: configs.inferior,
    cut: configs.corte,
    pulse,
  })
}
