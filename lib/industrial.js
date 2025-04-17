const slugify = require('slugify');
const marked = require('marked');
const nunjucks = require('nunjucks');
/**
 * Generic Industrial Plugin for doing stuff with the site build
 *  - manipulates files object before rendering
 *  - exposes some filters/templating functions passed to the template engine
 *  - houses a siteConfig object with values used in the buid
 */

module.exports ={
    plugin:plugin,
    navLabel:navLabel,
    titleCase: titleCase,
    reverseSlug: reverseSlug,
    findByField,findByField,
    cssClassify:cssClassify,
    markdownToHtml: markdownToHtml,
    blogExcerpt: blogExcerpt,
    getRelatedPosts: getRelatedPosts,
    getYoutubeThumbnail: getYoutubeThumbnail,
    getYoutubeId:getYoutubeId,
    siteConfig : {
        seoSuffix: " - Duroair",
        siteUrl: "https://www.duroair.com",
        siteName: "Duroair",
        blogPath: "",
        navConfigs: {
            primary: {
                sortBy: "nav_sort",
                filterProperty: "show_in_menu",
                filterValue: "true",
                includeDirs: true,
                permalinks: false
            }
        },
        navSettings: {
            permalinks: true
        }
    }
} 
    
function markdownToHtml (str){
    let out = '';
    if(str){
        out = marked.parse(str);
    }
    return out;
}

function blogExcerpt (post){
    let out = '';
    if(post.short_description){
        out = post.short_description;
    }else{
        out = nunjucks.renderString('{{contents | safe | striptags(false) | truncate(160) }}', post) + '...';
    }
    return out;
}
function getRelatedPosts(collection, allCollections){
    var collection = collection.filter(el => el !== 'posts');
    var related = collection.shift();
    var relatedPosts = allCollections[related] || [];
    
    return relatedPosts.slice(0, 3);
}
/**
 *  Title case text
 * @param {string} str text to title case
 */
function titleCase(str) {
    if (!str) {
        return str;
    }
    let exclusions = ["of", "the", "is", "for", "a", "and", "to", "with", "into", "on"];
    let words = str.split(" ");
    for (var i = 0; i < words.length; i++) {
        let word = words[i];

        if (exclusions.includes(word.toLowerCase()) && i > 0) {
            words[i] = word.toLowerCase() + " ";
        } else {
            words[i] = word.charAt(0).toUpperCase() + word.slice(1);
        }
    }
    return words.join(" ");
};
function getYoutubeId(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID;
}
function getYoutubeThumbnail(url){
    
    let id = getYoutubeId(url);
    return `https://img.youtube.com/vi/${id}/0.jpg`;
}
function reverseSlug(str) {
    if (!str) {
        return str;
    }

    var words = str.split("-");

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(" ");
};
/**
 * Find an item in collection by field value
 * @param {*} val
 * @param {string} field to search in collection
 * @param {array} collection - metalsmith collection
 */
function findByField(val, field, collection) {
    if (!val || !field || !collection) {
        return "";
    }
    let r = collection.find(item => item[field] === val);
    return r;
};
/**
 *  Get body classes
 * @param {string} path
 */
function cssClassify(val) {
    let cssClass = val
        ? val
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace("/", "-")
              .replace(".njk", "")
        : "home";
    return cssClass;
};
/**
 *  Get nav label or default to title
 * @param {object} val
 */
function navLabel(val) {
    return val.nav_title ? val.nav_title : val.title;
};
/**
 * A Metalsmith plugin to modify files as needed
 *
 * @return {Function}
 */

function plugin() {

    


    return function(files, metalsmith) {
        for (var file in files) {
            // add property to cause blog index file to show in navigation menu
            // if (file === "blog/index.html") {
            //     files[file].show_in_menu = "true";
            //     files[file].nav_sort = 100;
            //     files[file].permalink = "/resources/blog"
            // }
            if(typeof(files[file].permalink) === 'string'){
                files[file].path = files[file].permalink + '/index.html';
            }

            //handle products within categories by appending category slug to url
            // if(files[file].layout === 'product.njk' && files[file].collection){
            //     let pl = 'products/'+slugify(files[file].collection[0].toLowerCase())+'/'+slugify(files[file].title.toLowerCase());
            //     files[file].permalink = pl;
            // }

            
        }
        //inject blog index file so it shows in nav
        files['resources/blog/index.html'] = Object.assign(files['blog/index.html']);
        files['resources/blog/index.html'].show_in_menu = "true";
        files['resources/blog/index.html'].nav_sort = 1;
        files['resources/blog/index.html'] = {
            layout: "blog-index.njk",
            show_in_menu : "true",
            title: "Blog",
            path: 'blog',
            seo:{description:'The latest articles around end-to-end air quality solutions such as clean rooms and retractable enclosures'},
            nav_sort: 1,
            contents: []
        }
        
        files['blog/index.html'].show_in_menu = "false";
        
    };
}
