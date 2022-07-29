## Description

This project, is a simple system to reprocess fake pending pix transactions.

## Installation
Necessary to create **.env** file in the project root.

| key                                    | value  |
| :------------------------------------- | ------:|
| URL_TRANSACTIONS_AWAITING_REPROCESSING | [Talk to me](https://www.linkedin.com/in/victor-nevola/) |
| URL_BANK_CLIENTS                       | [Talk to me](https://www.linkedin.com/in/victor-nevola/) |
| URL_CLIENT_BALANCE                     | [Talk to me](https://www.linkedin.com/in/victor-nevola/) |

After create .env file, run this command:
```bash
$ yarn
```
## Running the app

```bash
# watch mode
$ yarn start:dev

# production mode
$ yarn build
$ yarn start:prod

# production mode on docker (docker and docker-compose is required)
$ docker-compose up #this run in terminal mode
```
## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```

## Availables Routers

### [GET] /reprocess
#### Description
Return list all pending transactions

#### Response
```
Content-type: application/json
```

```json

[
    {
        "customerID": "fake-customerID",
        "email": "fakeemail@doc.com",
        "key": "CPF || PHONE NUMBER || EMAIL",
        "value": 9999.99,
        "bank": null
    }
]

```
### [PATCH] /reprocess
#### Description
Update transaction for user, current emails on body request

#### Body
```json 
  {
    "emails": ["fake-1@doc.com", "fake-2@doc.com"]
  }

```
#### Response
```
Content-type: application/json
```

```json

[
    {
        "email": "fake-1@doc.com",
        "status": "Transaction processed success || Transaction not found || Transaction key not valid || Transaction Bank info not found || Transaction Balance not available",
        "valueTransaction": 526.53,
        "initialBalance": 5000,
        "currentBalance": 4473.47
    },
    {
        "email": "fake-2@doc.com",
        "status": "Transaction processed success || Transaction not found || Transaction key not valid || Transaction Bank info not found || Transaction Balance not available",
        "valueTransaction": 526.53,
        "initialBalance": 9999,
        "currentBalance": 5525.53
    },
]

```