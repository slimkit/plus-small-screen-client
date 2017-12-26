// let database = {};
// // init local database;
// if("openDatabase" in window) { // openDatabase
// 	database = openDatabase("thinksns-plus", "1.0", "ThinkSNS+", '1024 * 1024');
// 	if(!database) {
// 		console.log('hhh');
// 	} else {
// 		console.log('websql success');
// 	}
// } else { // indexDB
// 	let openRequest = indexedDB.open("thinksns-plus",1);

// 	openRequest.onupgradeneeded = function(e) {
// 	    console.log("Upgrading...");
// 	}
	 
// 	openRequest.onsuccess = function(e) {
// 	    console.log("Success!");
// 	    database = e.target.result;
// 	}
	 
// 	openRequest.onerror = function(e) {
// 	    console.log("Error");
// 	    console.dir(e);
// 	}
// }

function localDatabase (tableName, data)  {
	let database = {};
	let dataObj = JSON.parse(data);
	if("openDatabase" in window) { // openDatabase
		database = openDatabase("thinksns-plus-test3", "1.0", "ThinkSNS+", '1024 * 1024 * 20');
		if(!database) {
			console.log('SOME ERRORS');
		} else {
			if(tableName == 'imMessage') {
				let dbData = [dataObj.user_id, dataObj.cid, dataObj.ctime, dataObj.content, dataObj.hash];
				database.transaction(function (tx) {
			      	tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (user_id integer, cid integer, ctime integer, content, hash)`);
			      	tx.executeSql(
			      		`INSERT INTO ${tableName} (user_id, cid, ctime, content, hash) values (?, ?, ?, ?, ?)`,
			      		dbData,
			      		function () { 
			      			console.log('添加数据成功'); 
			      		},
				        function (tx, error) {
				        	console.log('添加数据失败: ' + error.message); 
				        }
			      	)
			   	});
			}
		}
	}
};

function getImMessageItem (tableName, data) {
	return new Promise( (resolove, reject) => {
		let database = {};
		let dataObj = JSON.parse(data);
		let where = `where hash = '${dataObj.hash}'`;
		if("openDatabase" in window) {
			database = openDatabase("thinksns-plus-test3", "1.0", "ThinkSNS+", '1024 * 1024 * 20');
			if(!database) {
				// console.log('SOME ERRORS');
			} else {
				database.transaction(function (tx) {
					console.log(`SELECT * FROM ${tableName} ${where}`);
				   	tx.executeSql(
				   		`SELECT * FROM ${tableName} ${where}`, 
				   		[], 
				   		function (tx, result) {  //执行成功的回调函数
				   			resolove(result);
	            		},
				        function (tx, error) {
				            reject('查询失败: ' + error.message);
				        }
				    ) 
	 			}); 
			}
		}
	});
};

function getDatas (tableName, data) {
	return new Promise( (resolove, reject) => {
		let database= {};
		let dataObj = JSON.parse(data);
		let limit = ` limit 15`;
		let where = ` where cid = ${dataObj.cid}`;
		if(dataObj.max_id > 0) {
			where += ` where rowid < ${dataObj.max_id}`;
		}
		if("openDatabase" in window) { // openDatabase
			database = openDatabase("thinksns-plus-test3", "1.0", "ThinkSNS+", '1024 * 1024 * 20');
			if(!database) {
				console.log('SOME ERRORS');
			} else {
				database.transaction(function (tx) {
				   	tx.executeSql(
				   		`SELECT * FROM ${tableName} ${where} Order By rowid desc ${limit}`, 
				   		[], 
				   		function (tx, result) {  //执行成功的回调函数
				   			resolove(result);
	            		},
				        function (tx, error) {
				            reject('查询失败: ' + error.message);
				        }
				    ) 
	 			}); 
			}
		}
	});
};

export{
	localDatabase,
	getDatas,
	getImMessageItem
}

