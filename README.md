# HellaAPI

An Arknights EN game data API made for my own use. Data is loaded from [Kengxxiao/ArknightsGameData_YoStar](https://github.com/Kengxxiao/ArknightsGameData_YoStar), lightly massaged into a nicer format, and sent into a MongoDB Atlas database. Made with Express and hosted on Cyclic. Also an under construction personal project.

## Usage

Base URL: https://hellabotapi.cyclic.app

### Data format

Valid responses will have the below JSON format. The `keys` array contains all valid keys for that resource, and the `value` field is where the actual useful information resides.

See here for all returned value types: https://github.com/Awedtan/HellaTypes

```
{
    _id: string
    keys: [ key1, key2, ... ]
    value: {
        ...
    }
}
```

### Endpoints

| Endpoint | Description | Valid Queries | Return Type |
|-|-|-|-|
| https://hellabotapi.cyclic.app/archetype/              | External archetype name | Internal archetype name | `string`     |
| https://hellabotapi.cyclic.app/base/                   | RIIC base skills        | Base skill ID           | `Base`       |
| https://hellabotapi.cyclic.app/cc/                     | CC stages               | Stage ID/name           | `CCStage`    |
| https://hellabotapi.cyclic.app/define/                 | In-game terms           | Term name               | `Definition` |
| https://hellabotapi.cyclic.app/enemy/                  | Enemies                 | Enemy ID/name/code      | `Enemy`      |
| https://hellabotapi.cyclic.app/event/                  | Game events             | Event ID                | `GameEvent`  |
| https://hellabotapi.cyclic.app/item/                   | Items                   | Item ID/name            | `Item`       |
| https://hellabotapi.cyclic.app/module/                 | Modules                 | Module ID               | `Module`     |
| https://hellabotapi.cyclic.app/operator/               | Operators               | Operator ID/name        | `Operator`   |
| https://hellabotapi.cyclic.app/paradox/                | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://hellabotapi.cyclic.app/range/                  | Operator attack ranges  | Range ID                | `GridRange`  |
| https://hellabotapi.cyclic.app/rogue/                  | Integrated Strategies   | IS index (IS2=0, IS3=1) | `RogueTheme` |
| https://hellabotapi.cyclic.app/roguestage/[index]      | IS stages               | IS stage ID/name        | `RogueStage` |
| https://hellabotapi.cyclic.app/roguetoughstage/[index] | IS emergency stages     | IS stage ID/name        | `RogueStage` |
| https://hellabotapi.cyclic.app/sandbox/                | Reclamation Algorithm   | RA index                | `SandboxAct` |
| https://hellabotapi.cyclic.app/skill/                  | Operator skills         | Skill ID                | `Skill`      |
| https://hellabotapi.cyclic.app/skin/                   | Operator skins          | Operator ID             | `Skin[]`     |
| https://hellabotapi.cyclic.app/stage/                  | Normal stages           | Stage ID/code           | `Stage[]`    |
| https://hellabotapi.cyclic.app/toughstage/             | Challenge stages        | Stage ID/code           | `Stage[]`    |
| CN (experimental) |
| https://hellabotapi.cyclic.app/cn/archetype/           | External archetype name | Internal archetype name | `string`     |
| https://hellabotapi.cyclic.app/cn/base/                | RIIC base skills        | Base skill ID           | `Base`       |
| https://hellabotapi.cyclic.app/cn/module/              | Modules                 | Module ID               | `Module`     |
| https://hellabotapi.cyclic.app/cn/operator/            | Operators               | Operator ID/name        | `Operator`   |
| https://hellabotapi.cyclic.app/cn/paradox/             | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://hellabotapi.cyclic.app/cn/range/               | Operator attack ranges  | Range ID                | `GridRange`  |
| https://hellabotapi.cyclic.app/cn/skill/               | Operator skills         | Skill ID                | `Skill`      |
| https://hellabotapi.cyclic.app/cn/skin/                | Operator skins          | Operator ID             | `Skin[]`     |


### Parameters

All routes support passing multiple exclude and include parameters. Excluding fields will exclude them from the returned `value` field. Including fields will exclude all non-included fields. If a request contains both include and exclude parameters, only include parameters will be considered.

### Examples:

https://hellabotapi.cyclic.app/define/slow?exclude=termId&exclude=termName

https://hellabotapi.cyclic.app/define/slow?include=description

These two requests are functionally identical and will return the same object. They both exclude the `termId` and `termName` fields from the `Definition` object, leaving only the `description` field.

https://hellabotapi.cyclic.app/stage

https://hellabotapi.cyclic.app/stage?exclude=levels

https://hellabotapi.cyclic.app/stage?include=excel.name

The first request won't work, but the second and third will. The `levels` field contains a ton of useless(?) information like map layout, enemy spawn timings, etc. By excluding it, the return value doesn't hit the magic size limit that seems to be in place. The third request also demonstrates passing nested fields; it only returns the name of each stage.