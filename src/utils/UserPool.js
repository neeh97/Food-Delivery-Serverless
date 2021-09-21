import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_5gDSAMkM7",
  ClientId: "60v1khg1l7boqeevmqkhcgqmhh"
}

export default new CognitoUserPool(poolData);