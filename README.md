# Combine Multidisc DAT

## Usage

To use simply install the Node.js dependencies and then run the script, passing it a DAT file.

```sh
npm install
npm start psx.dat
```

## Purpose

Finds all games that are listed with multiple discs separately and combines them into a single game. For example, if your DAT file contains the following:

```xml
<game name="Final Fantasy VII (USA) (Disc 1)">
  <category>Games</category>
  <description>Final Fantasy VII (USA) (Disc 1)</description>
  <rom name="Final Fantasy VII (USA) (Disc 1).cue" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 1).bin" size="..." crc="..." md5="..." sha1="..."/>
</game>
<game name="Final Fantasy VII (USA) (Disc 2)">
  <category>Games</category>
  <description>Final Fantasy VII (USA) (Disc 2)</description>
  <rom name="Final Fantasy VII (USA) (Disc 2).cue" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 2).bin" size="..." crc="..." md5="..." sha1="..."/>
</game>
<game name="Final Fantasy VII (USA) (Disc 3)">
  <category>Games</category>
  <description>Final Fantasy VII (USA) (Disc 3)</description>
  <rom name="Final Fantasy VII (USA) (Disc 3).cue" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 3).bin" size="..." crc="..." md5="..." sha1="..."/>
</game>
```

After running the script the new DAT file will contain the following instead:

```xml
<game name="Final Fantasy VII (USA)">
  <category>Games</category>
  <description>Final Fantasy VII (USA)</description>
  <rom name="Final Fantasy VII (USA) (Disc 1).cue" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 1).bin" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 2).cue" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 2).bin" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 3).cue" size="..." crc="..." md5="..." sha1="..."/>
  <rom name="Final Fantasy VII (USA) (Disc 3).bin" size="..." crc="..." md5="..." sha1="..."/>
</game>
```

The updated DAT file will be output next to the original with `-combined` at the end of the filename.

## Notes

Has currently only been tested with the Redump PlayStation DAT file, but should work with any DAT file that follows the same format.
