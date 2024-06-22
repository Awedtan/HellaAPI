# HellaAPI


> https://awedtan.ca/api

> ~~https://hellabotapi.cyclic.app~~

An Arknights EN game data API made for my own use. Data is loaded from [Kengxxiao/ArknightsGameData_YoStar](https://github.com/Kengxxiao/ArknightsGameData_YoStar), lightly massaged into a nicer format, and sent into a MongoDB Atlas database. Made with Express and ~~hosted on Cyclic~~ self-hosted (RIP). Also an under construction personal project.

## Usage

To query the API, send an HTTP GET request to an endpoint. All endpoints support four different operations:

#### Multi

> api/resource

Returns all documents under the specified resource type.

#### Single

> api/resource/{key}

Returns a single document whose `keys` array includes the specified key. Checks for exact, whole string equality.

#### Match

> api/resource/match/{key}

Returns all documents whose `keys` array includes the specified key. Checks for substring matches.

#### Search

> api/resource/search?{field1}={value1}&{field2}={value2}

Returns all documents where their fields are equal to the specified values. Uses dot notation for searching nested fields.

### Additional Parameters

In addition to the four modes, all endpoints also support the following parameters:

#### Include

> api/resource?include={field1}&include={field2}

Specify fields to include in the response. If a request contains both `include` and `exclude` parameters, only `include` parameters will be considered.

#### Exclude

> api/resource?exclude={field1}&exclude={field2}

Specify fields to exclude from the response. If a request contains both `include` and `exclude` parameters, only `include` parameters will be considered.

#### Limit

> api/resource?limit={number}

Specify a maximum number of documents to return.

### Data format

Valid responses will have the below JSON format. The `keys` array contains all valid keys for that resource, and the `value` field is where the actual information resides<sup>1</sup>.

```
{
    _id: string,
    meta: { ... },
    canon: canon_key,
    keys: [ key1, key2, ... ]
    value: {
        ...
    }
}
```

### Examples

This request will get all "Musha" operators (Hellagur, Utage, etc.) and returns their rarity.

> https://awedtan.ca/api/operator/search?data.subProfessionId=musha&include=data.rarity

These two requests are functionally identical and will return the same object. They both exclude the `termId` and `termName` fields from the `Definition` object, leaving only the `description` field.

> https://awedtan.ca/api/define/slow?exclude=termId&exclude=termName
> 
> https://awedtan.ca/api/define/slow?include=description

Requests that return very large amounts of data may take a long time or even time out. By excluding unneeded fields, both response times and sizes can be dramatically decreased.

> This will likely time out:
>
> https://awedtan.ca/api/stage
>
> This probably won't time out but will still take a while:
>
> https://awedtan.ca/api/stage?exclude=levels
>
> This will have the fastest response time:
>
> https://awedtan.ca/api/stage?include=excel.name

## Endpoints

| Resources | Description | Valid Keys | Return Type<sup>1</sup> |
|-|-|-|-|
| https://awedtan.ca/api/archetype               | External archetype name | Internal archetype name | `string`     |
| https://awedtan.ca/api/base                    | RIIC base skills        | Base skill ID           | `Base`       |
| https://awedtan.ca/api/cc                      | CC stages               | Stage ID/name           | `CCStage`    |
| https://awedtan.ca/api/define                  | In-game terms           | Term name               | `Definition` |
| https://awedtan.ca/api/enemy                   | Enemies                 | Enemy ID/name/code      | `Enemy`      |
| https://awedtan.ca/api/event                   | Game events             | Event ID                | `GameEvent`  |
| https://awedtan.ca/api/item                    | Items                   | Item ID/name            | `Item`       |
| https://awedtan.ca/api/module                  | Modules                 | Module ID               | `Module`     |
| https://awedtan.ca/api/operator                | Operators               | Operator ID/name        | `Operator`   |
| https://awedtan.ca/api/paradox                 | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://awedtan.ca/api/range                   | Operator attack ranges  | Range ID                | `GridRange`  |
| https://awedtan.ca/api/rogue                   | Integrated Strategies   | IS index (IS2=0, IS3=1) | `RogueTheme` |
| https://awedtan.ca/api/roguestage/{index}      | IS stages               | IS stage ID/name        | `RogueStage` |
| https://awedtan.ca/api/roguetoughstage/{index} | IS emergency stages     | IS stage ID/name        | `RogueStage` |
| https://awedtan.ca/api/sandbox                 | Reclamation Algorithm   | RA index                | `SandboxAct` |
| https://awedtan.ca/api/skill                   | Operator skills         | Skill ID                | `Skill`      |
| https://awedtan.ca/api/skin                    | Operator skins          | Skin ID                 | `Skin[]`     |
| https://awedtan.ca/api/stage                   | Normal stages           | Stage ID/code           | `Stage[]`    |
| https://awedtan.ca/api/toughstage              | Challenge stages        | Stage ID/code           | `Stage[]`    |
| CN (experimental) |
| https://awedtan.ca/api/cn/archetype            | External archetype name | Internal archetype name | `string`     |
| https://awedtan.ca/api/cn/base                 | RIIC base skills        | Base skill ID           | `Base`       |
| https://awedtan.ca/api/cn/module               | Modules                 | Module ID               | `Module`     |
| https://awedtan.ca/api/cn/operator             | Operators               | Operator ID/name        | `Operator`   |
| https://awedtan.ca/api/cn/paradox              | Paradox Simulations     | Operator ID             | `Paradox`    |
| https://awedtan.ca/api/cn/range                | Operator attack ranges  | Range ID                | `GridRange`  |
| https://awedtan.ca/api/cn/skill                | Operator skills         | Skill ID                | `Skill`      |
| https://awedtan.ca/api/cn/skin                 | Operator skins          | Skin ID                 | `Skin[]`     |

<sup>1</sup> See here for all return types: https://github.com/Awedtan/HellaTypes/blob/main/src/index.ts
