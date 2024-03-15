const {
    REACT_APP_DEV_PUBLIC_URL,
    REACT_APP_PROD_PUBLIC_URL,
    NODE_ENV
} = process.env;

const DEV_ENV = {
    PUBLIC_URL: REACT_APP_DEV_PUBLIC_URL,
};

const PROD_ENV = {
    PUBLIC_URL: REACT_APP_PROD_PUBLIC_URL,
}

const ENV = NODE_ENV === "development" ? DEV_ENV : PROD_ENV;

export default ENV;