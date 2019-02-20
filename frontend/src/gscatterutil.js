import GScatterJS from 'gscatterjs-core';

var network = {
    blockchain: 'gxc',
    protocol: 'https',
    host: 'testnet.gxchain.org',
    port: 443,
    chainId: 'c2af30ef9340ff81fd61654295e98a1ff04b23189748f86727d0b26b40bb0ff4'
}

let gscatter = null;
let gxcapi;
let gconnected = false;
let contract_name = 'todolist2'; 

//export命令定义了模块的对外接口
export default class GScatterutil {
    static async init() {
        //ES6 Promise
        console.log("GScatterutil init")
        return new Promise(async resolve => {
            GScatterJS.gscatter.connect("todogame").then(connected => {
                if (!connected) {
                    resolve("false");
                    return false;
                }
                gscatter = GScatterJS.gscatter;
                gxcapi = gscatter.gxc(network);
                gconnected = true;
                console.log("gconnected", gconnected)
                // 必须清空对象防止泄露对象。
                window.scatter = null;
                resolve("true");
            })
        })
    }


    static async getTodoList(){
        return new Promise(async resolve => {
            gxcapi.getTableObjects(contract_name, 'todo', 0, 100).then(result => {
                console.log(`getTableObjects success`, result);
                resolve(result)
            }).catch(error => {
                resolve("");
                console.error(error);
            });
        });
    }

    static async create(description){

        console.log(description)
        return new Promise(async resolve => {
            gxcapi.callContract(contract_name, 'create', {description:description}, '0 GXC', true).then(trx => {
                console.log(`create success`, trx);
                resolve("success")
            }).catch(error => {
                if(error.code === 435){
                    alert('you don\'t authorize identity!')
                }
                console.error(error);
                resolve("")
            });
        });
    }

    static async complete(id){
        console.log(id)
        return new Promise(async resolve => {
            gxcapi.callContract(contract_name, 'complete', {id: id}, '0 GXC', true).then(trx => {
                console.log(`complete success`, trx);
                resolve("success")
            }).catch(error => {
                if(error.code === 435){
                    alert('you don\'t authorize identity!')
                }
                console.error(error);
                resolve("")
            });
        });
    }

    static async destory(id){
        console.log(id)
        return new Promise(async resolve => {
            gxcapi.callContract(contract_name, 'destory', {id: id}, '0 GXC', true).then(trx => {
                console.log(`destory success`, trx);
                resolve("success")
            }).catch(error => {
                if(error.code === 435){
                    alert('you don\'t authorize identity!')
                }
                console.error(error);
                resolve("")
            });
        });
    }

    static async login(){
        console.log(gconnected);
        if (!gconnected) {
            console.log('not connected');
            return;
        }

        try {
                // if you want user add the network, you could call suggestNetwork, if user already has, nothing happen
                await gscatter.suggestNetwork(network);
            } catch (err) {
                // user refuse or close the prompt window
                console.error(err)
                console.log("login fail,", err)
                return;
            }

            try {
                // getIdentity with required fields, it will appear at gscatter.identity
                await gscatter.getIdentity({ accounts: [network] })
            } catch (err) {
                // user refuse or close the prompt window
                console.error(err)
                console.log("login fail,", err)
                return;
            }

            // you could get gscatter.identity.accounts because of { accounts: [network] } before
            const account = gscatter.identity.accounts.find(x => x.blockchain === 'gxc');
            console.log("login success,", account)
            //displayAccountInfo(account)
    }

}