
module.exports ={
    plugin:plugin
} 
    

function plugin() {

    return function(files, metalsmith) {
        const name = 'sitemap.xml';
       
        if(files[name]){
            // let content = files[name].contents.toString();
            // content = content.replaceAll('/</loc>', '</loc>');
           files[name].contents = Buffer.from(files[name].contents.toString().replaceAll('/</loc>', '</loc>'))
        }
    };
}
