const {
    REACT_APP_DEV_PUBLIC_URL,
    REACT_APP_PROD_PUBLIC_URL,
    NODE_ENV
} = process.env;

const DEV_ENV = {
    PUBLIC_URL: REACT_APP_DEV_PUBLIC_URL,
    FILE_SERVER_BASEURL: "https://bansi-terminal-qa.s3.ap-south-1.amazonaws.com"
};

const PROD_ENV = {
    PUBLIC_URL: REACT_APP_PROD_PUBLIC_URL,
    FILE_SERVER_BASEURL: "https://bansi-terminal-qa.s3.ap-south-1.amazonaws.com"
}

const ENV = NODE_ENV === "development" ? DEV_ENV : PROD_ENV;

export default ENV;