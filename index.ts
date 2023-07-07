import { readFileSync, writeFileSync } from "fs"
import { join, parse } from "path"
import { Builder, parseString } from "xml2js"

type Rom = {
  $: {
    name: string
    size: string
    crc: string
    md5: string
    sha1: string
  }
}

type Game = {
  $: { name: string }
  category: [string]
  description: [string]
  rom: Rom[]
}

type Datfile = {
  datafile: {
    header: unknown
    game: Game[]
  }
}

if (process.argv.length !== 3) {
  throw new Error("A datfile must be provided as an argument")
}

const filename = process.argv[2]
const xml = readFileSync(filename, { encoding: "utf8" })

const combinedGames: Game[] = []

parseString(xml, (err, dat: Datfile) => {
  if (err) throw err

  dat.datafile.game.map((game) => {
    const { name } = game.$

    if (name.match(/ \(Disc \d\)/)) {
      const combinedName = name.replace(/ \(Disc \d\)/, "")

      const existingGame = combinedGames.find(
        (combinedGame) => combinedGame.$.name === combinedName
      )

      if (existingGame) {
        existingGame.rom.push(...game.rom)
      } else {
        game.$.name = combinedName
        game.description = [combinedName]
        combinedGames.push(game)
      }
    } else {
      combinedGames.push(game)
    }
  })

  const newDatfile: Datfile = {
    datafile: {
      header: dat.datafile.header,
      game: combinedGames,
    },
  }

  const builder = new Builder()
  const newXml = builder.buildObject(newDatfile)

  const { dir, ext, name } = parse(filename)
  const outputFilename = join(dir, `${name}-combined${ext}`)
  writeFileSync(outputFilename, newXml)
})
