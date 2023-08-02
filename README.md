# HellaAPI

An Arknights game data API made for [HellaBot](https://github.com/Awedtan/HellaBot). Data is loaded from [Kengxxiao/ArknightsGameData](https://github.com/Kengxxiao/ArknightsGameData), lightly massaged into a nicer format, and sent into a MongoDB Atlas database. Made with Express and hosted on Cyclic. Also an under construction fun personal project.

Where possible, each resource keeps a similar structure to how it appears in the original files. The notable exception is operator data, where I crammed as much relevant information into each operator entry as I could. If it seems like there are implementation inconsistencies in anything, that's because there are.

## Usage

Base URL: `https://hellabotapi.cyclic.app`

### Data format

Responses will have the below JSON format. The `keys` array contains all valid queries for that resource, and the `value` field is where the actual useful information resides. I am too lazy to return only the value field or remove _id.

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

You can fetch all resources of a type by excluding the query in your request (e.g. https://hellabotapi.cyclic.app/item to get information for all items). This currently does not work for `stage` and `toughstage` since my poor app can't send all that data (excluding fields can help, see Parameters section). 

Note that querying a single stage will return an array of values. This is because I needed to be able to search stages by code, but Hypergryph had the great idea to not have stage codes be unique (e.g. SV-1). Therefore, array. 

See here for what the return types actually are: https://github.com/Awedtan/HellaBot/blob/main/src/types.d.ts

| Endpoint | Description | Valid Queries | Return Type |
|-|-|-|-|
| https://hellabotapi.cyclic.app/archetype/:query  | Archetype display names | Internal archetype name | string       |
| https://hellabotapi.cyclic.app/base/:query       | RIIC base skills        | Base skill ID           | `Base`       |
| https://hellabotapi.cyclic.app/cc/:query         | CC stages               | Stage ID/name           | `CCStage`    |
| https://hellabotapi.cyclic.app/define/:query     | In-game terms           | Term name               | `Definition` |
| https://hellabotapi.cyclic.app/enemy/:query      | Enemies                 | Enemy ID/name/code      | `Enemy`      |
| https://hellabotapi.cyclic.app/event/:query      | Game events             | Event ID                | `GameEvent`  |
| https://hellabotapi.cyclic.app/item/:query       | Items                   | Item ID/name            | `Item`       |
| https://hellabotapi.cyclic.app/module/:query     | Modules                 | Module ID               | `Module`     |
| https://hellabotapi.cyclic.app/operator/:query   | Operators               | Operator ID/name        | `Operator`   |
| https://hellabotapi.cyclic.app/paradox/:query    | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://hellabotapi.cyclic.app/range/:query      | Operator attack ranges  | Range ID                | `GridRange`  |
| https://hellabotapi.cyclic.app/rogue/:query      | Integrated Strategies   | IS index (IS2=0, IS3=1) | `RogueTheme` |
| https://hellabotapi.cyclic.app/skill/:query      | Operator skills         | Skill ID                | `Skill`      |
| https://hellabotapi.cyclic.app/skin/:query       | Operator skins          | Operator ID             | `Skin[]`     |
| https://hellabotapi.cyclic.app/stage/:query      | Normal stages           | Stage ID/code           | `Stage[]`    |
| https://hellabotapi.cyclic.app/toughstage/:query | Challenge stages        | Stage ID/code           | `Stage[]`    |

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