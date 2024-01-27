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
    mia?: "yes"
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

// TODO: Move this to be passed in as an external file.
const miaList = [
  "Arc the Lad III (Japan) (Demo 2)",
  "Casper - Friends Around the World (Korea)",
  "Ehrgeiz - God Bless the Ring (Japan) (Demo 2)",
  "Frogger 2 - Swampy's Revenge (Europe) (Beta) (2000-02-04)",
  "Frogger 2 - Swampy's Revenge (Europe) (Beta) (2000-06-06)",
  "Frogger 2 - Swampy's Revenge (Europe) (Beta) (2000-06-29)",
  "Frogger 2 - Swampy's Revenge (Europe) (Beta) (2000-07-25)",
  "Frogger 2 - Swampy's Revenge (Europe) (En,Fr,De,It) (Beta) (2000-03-01)",
  "Frogger 2 - Swampy's Revenge (USA) (Beta) (2000-04-05)",
  "Frogger 2 - Swampy's Revenge (USA) (Beta) (2000-06-09)",
  "Frogger 2 - Swampy's Revenge (USA) (Beta) (2000-06-14)",
  "Frogger 2 - Swampy's Revenge (USA) (Beta) (2000-07-18)",
  "Frogger 2 - Swampy's Revenge (USA) (Beta) (2000-07-25)",
  "Frogger 2 - Swampy's Revenge (USA) (Beta) (2000-07-31)",
  "Ore no Shikabane o Koete Yuke (Japan) (Demo)",
]

parseString(xml, (err, dat: Datfile) => {
  if (err) throw err

  dat.datafile.game.map((game) => {
    const { name } = game.$

    if (miaList.includes(name)) {
      game.rom.forEach((rom) => (rom.$.mia = "yes"))
    }

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
