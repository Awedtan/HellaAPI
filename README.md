# HellaAPI

> https://hellabotapi.cyclic.app

An Arknights EN game data API made for my own use. Data is loaded from [Kengxxiao/ArknightsGameData_YoStar](https://github.com/Kengxxiao/ArknightsGameData_YoStar), lightly massaged into a nicer format, and sent into a MongoDB Atlas database. Made with Express and hosted on Cyclic. Also an under construction personal project.

## Usage

To query the API, send an HTTP GET request to an endpoint. All endpoints support four different operations:

#### Multi

> app/resource

Returns all documents under the specified resource type.

#### Single

> app/resource/{key}

Returns a single document whose `keys` array includes the specified key. Checks for exact, whole string equality.

#### Match

> app/resource/match/{key}

Returns all documents whose `keys` array includes the specified key. Checks for substring matches.

#### Search

> app/resource/search?{field1}={value1}&{field2}={value2}

Returns all documents where their fields are equal to the specified values. Uses dot notation for searching nested fields.

### Additional Parameters

In addition to the four modes, all endpoints also support the following parameters:

#### Include

Specify fields to include in the response. If a request contains both `include` and `exclude` parameters, only `include` parameters will be considered.

> app/resource?include={field1}&include={field2}

#### Exclude

Specify fields to exclude from the response.

> app/resource?exclude={field1}&exclude={field2}

#### Limit

Specify a maximum number of documents to return.

> app/resource?limit={number}

### Data format

Valid responses will have the below JSON format. The `keys` array contains all valid keys for that resource, and the `value` field is where the actual information resides<sup>1</sup>.

```
{
    _id: string
    keys: [ key1, key2, ... ]
    value: {
        ...
    }
}
```

### Examples

> https://hellabotapi.cyclic.app/operator/search?data.subProfessionId=musha&include=data.rarity

This request will get all "Musha" operators (Hellagur, Utage, etc.) and returns their rarity.

> https://hellabotapi.cyclic.app/define/slow?exclude=termId&exclude=termName

> https://hellabotapi.cyclic.app/define/slow?include=description

These two requests are functionally identical and will return the same object. They both exclude the `termId` and `termName` fields from the `Definition` object, leaving only the `description` field.

> https://hellabotapi.cyclic.app/stage

> https://hellabotapi.cyclic.app/stage?exclude=levels

> https://hellabotapi.cyclic.app/stage?include=excel.name

Requests that return very large amounts of data may not work, which seems to be a Cyclic limitation. By strategically including and excluding certain fields, both response times and sizes can be dramatically decreased.

## Endpoints

| Resources | Description | Valid Keys | Return Type<sup>1</sup> |
|-|-|-|-|
| https://hellabotapi.cyclic.app/archetype               | External archetype name | Internal archetype name | `string`     |
| https://hellabotapi.cyclic.app/base                    | RIIC base skills        | Base skill ID           | `Base`       |
| https://hellabotapi.cyclic.app/cc                      | CC stages               | Stage ID/name           | `CCStage`    |
| https://hellabotapi.cyclic.app/define                  | In-game terms           | Term name               | `Definition` |
| https://hellabotapi.cyclic.app/enemy                   | Enemies                 | Enemy ID/name/code      | `Enemy`      |
| https://hellabotapi.cyclic.app/event                   | Game events             | Event ID                | `GameEvent`  |
| https://hellabotapi.cyclic.app/item                    | Items                   | Item ID/name            | `Item`       |
| https://hellabotapi.cyclic.app/module                  | Modules                 | Module ID               | `Module`     |
| https://hellabotapi.cyclic.app/operator                | Operators               | Operator ID/name        | `Operator`   |
| https://hellabotapi.cyclic.app/paradox                 | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://hellabotapi.cyclic.app/range                   | Operator attack ranges  | Range ID                | `GridRange`  |
| https://hellabotapi.cyclic.app/rogue                   | Integrated Strategies   | IS index (IS2=0, IS3=1) | `RogueTheme` |
| https://hellabotapi.cyclic.app/roguestage/{index}      | IS stages               | IS stage ID/name        | `RogueStage` |
| https://hellabotapi.cyclic.app/roguetoughstage/{index} | IS emergency stages     | IS stage ID/name        | `RogueStage` |
| https://hellabotapi.cyclic.app/sandbox                 | Reclamation Algorithm   | RA index                | `SandboxAct` |
| https://hellabotapi.cyclic.app/skill                   | Operator skills         | Skill ID                | `Skill`      |
| https://hellabotapi.cyclic.app/skin                    | Operator skins          | Skin ID                 | `Skin[]`     |
| https://hellabotapi.cyclic.app/stage                   | Normal stages           | Stage ID/code           | `Stage[]`    |
| https://hellabotapi.cyclic.app/toughstage              | Challenge stages        | Stage ID/code           | `Stage[]`    |
| CN (experimental) |
| https://hellabotapi.cyclic.app/cn/archetype            | External archetype name | Internal archetype name | `string`     |
| https://hellabotapi.cyclic.app/cn/base                 | RIIC base skills        | Base skill ID           | `Base`       |
| https://hellabotapi.cyclic.app/cn/module               | Modules                 | Module ID               | `Module`     |
| https://hellabotapi.cyclic.app/cn/operator             | Operators               | Operator ID/name        | `Operator`   |
| https://hellabotapi.cyclic.app/cn/paradox              | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://hellabotapi.cyclic.app/cn/range                | Operator attack ranges  | Range ID                | `GridRange`  |
| https://hellabotapi.cyclic.app/cn/skill                | Operator skills         | Skill ID                | `Skill`      |
| https://hellabotapi.cyclic.app/cn/skin                 | Operator skins          | Skin ID                 | `Skin[]`     |

<sup>1</sup> See here for all return types: https://github.com/Awedtan/HellaTypes/blob/main/src/index.ts
