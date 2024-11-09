/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "Api": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "ChatMembers": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Chats": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Connections": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Conversations": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Frontend": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "IdentityPool": {
      "id": string
      "type": "sst.aws.CognitoIdentityPool"
    }
    "Messages": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Uploads": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "UserPool": {
      "id": string
      "type": "sst.aws.CognitoUserPool"
    }
    "UserPoolClient": {
      "id": string
      "secret": string
      "type": "sst.aws.CognitoUserPoolClient"
    }
    "Users": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "WSApi": {
      "managementEndpoint": string
      "type": "sst.aws.ApiGatewayWebSocket"
      "url": string
    }
  }
}
export {}
