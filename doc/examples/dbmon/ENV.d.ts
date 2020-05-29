declare const ENV: {
    generateData: (keepIdentity?: any) => {
        toArray: () => any;
    };
    rows: number;
    timeout: number;
    mutations: (value?: any) => number;
};
export default ENV;
