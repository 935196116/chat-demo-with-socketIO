

class TencentOSS{

      static getCgiUrl(destPath, sign) {
          const bucket = 'mycloudstore';
          const appid = '1252721733';

          const region = 'sh';
          const cosapi_cgi_url = "http://"+region+".file.myqcloud.com/files/v2/";

        let url = cosapi_cgi_url;
        url = url.replace('REGION', region);

        return url + appid + '/' + bucket + '/' + destPath + '?sign=' + sign;

      };
     static fixPath(path, type) {

        if (!path) {
            return '';
        }

        path = path.replace(/(^\/*)/g, '');
        if (type === 'folder') {
            path = encodeURIComponent(path + '/').replace(/%2F/g, '/');
        } else {
            path = encodeURIComponent(path).replace(/%2F/g, '/');
        }

        return path;
      }
      static getAppsign(){
         return new Promise(function (resolve, reject) {
             fetch('http://192.168.1.103/www/getToken.php').then((response)=>{


                 return response.json();
             }).then(responseJson=>{
                 console.log(responseJson);
                 resolve(responseJson.key);
             }).catch((error) => {
                 console.error(error);
                 reject(error);
             });
         });

      }
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
      static upLoad(sign,f){

          return new Promise(function (resolve, reject) {
              //生成唯一文件名
              let name = TencentOSS.guid();
              let hz = f.path.substring(f.path.lastIndexOf("."));

              let remotePath ="";
              if("width" in f)
              {
                   remotePath = "/"+name+"!"+f.width+"x"+f.height+hz;
              }
              else
              {
                  remotePath = "/"+name+hz;
              }

              if (remotePath.substr(remotePath.length - 1) === '/') {

                  reject({code: -1, message: 'path not allow end with "/"'});

                  return;
              }
              remotePath = TencentOSS.fixPath(remotePath);
              var url = TencentOSS.getCgiUrl(remotePath, sign);
              var formData = new FormData();
              insertOnly = 0;
              console.log(f);
              let file = {uri: f.path, type: 'multipart/form-data', name: name+hz};
              formData.append('op', 'upload');
              formData.append('fileContent', file);
              formData.append('insertOnly', insertOnly);
              console.log(url);

              var xhr = new XMLHttpRequest();
              xhr.open('POST', url, true);
              xhr.setRequestHeader('Origin', 'http://localhost');
              xhr.setRequestHeader('Host', 'sh.file.myqcloud.com');
              xhr.upload.onprogress = function (evt) {
                  var percent = evt.loaded / evt.total;
                  if (typeof onprogress === 'function') {
                      onprogress(percent, 0);
                  }
                  console.log("upload:"+percent);
              };


              xhr.onload= function(){
                  if(this.status === 200||this.status === 304){
                      resolve(this.responseText);
                  }
              };
              try {
                  xhr.send(formData);
              }
              catch(e){

                  reject(e);
              }
          });



      }
}
export  {TencentOSS as default}