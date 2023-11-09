export const api = new Proxy(
    {},
    {
        get:
            (target, key) =>
            (...args) =>
                window.myAPI.invoke("CALL_EXPOSED_MAIN_FN", {
                    methodName: key,
                    args,
                }),
    },
);
