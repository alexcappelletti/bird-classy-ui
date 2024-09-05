import * as Realm from 'realm-web';


const REALM_APP_ID ="bird_classy_app-jipkckb"// import.meta.env.VUE_APP_REALM_APP_ID;
const app = new Realm.App({ id: REALM_APP_ID });
const credentials = Realm.Credentials.anonymous();

// export class Log {
// 	constructor(_id, event, params, ts, userID){
// 		this._id = id;
// 		this.event = event;
// 		this.params = params;
// 		this.userID = userID
// 	}
// }
console.log("created const var in logto...")

export async function traceLog(l){
	const user = await app.logIn(credentials);
	const log = await user.functions.birdStoreLog(
		l.event, 
		l.timestamp ?? new Date(),
		l.params, 
		l.userID)
}