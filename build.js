const metalsmith = require("metalsmith");
const permalinks = require("metalsmith-permalinks");
const collections = require("metalsmith-collections");
const pagination = require("metalsmith-pagination");
const tags = require("metalsmith-collection-tags");
const metadata = require("metalsmith-collection-metadata");
const nav = require("metalsmith-navigation");
const debugUi = require("metalsmith-debug-ui");
const layouts = require("metalsmith-layouts");
const markdown = require("metalsmith-markdown");
const sitemap = require("metalsmith-mapsite");
const emailfeed = require("./lib/email_rss_feed.js");
const industrial = require("./lib/industrial.js");
const initYoutubes = require("./lib/youtubes.js");
const industrialPrivate = require("./lib/industrial.private.js");
const adjustSitemap = require("./lib/industrial.adjust-sitemap.js");
const lunr = require('metalsmith-lunr-index');
console.log('Staring Metalsmith build');
console.time('build');
//
const templateConfig = {
    engineOptions: {
        filters: {
            navLabel: industrial.navLabel,
            findByField: industrial.findByField,
            cssClassify: industrial.cssClassify,
            reverseSlug: industrial.reverseSlug,
            titleCase: industrial.titleCase,
            md: industrial.markdownToHtml,
            blogExcerpt: industrial.blogExcerpt,
            getRelatedPosts: industrial.getRelatedPosts,
            getYoutubeThumbnail: industrial.getYoutubeThumbnail,
            getYoutubeId: industrial.getYoutubeId
        },
        autoescape: false
    }
};
const now = new Date(); 
const siteBuild = metalsmith(__dirname)
    .metadata({
        modified: now,
        lastmod: now,
        year: now.getFullYear(),
        siteConfig: industrial.siteConfig,
        site:{
            title: 'Duroair'
        },
        env: process.env.NODE_ENV 
    })
    .source("./src/content/")
    .destination("./build/")
    .clean(true)
    .use(industrialPrivate.plugin())
    .use(initYoutubes())
    .use(
        collections({
            industries: {
                pattern: ["industries/*.md", "!industries/index.md"],
                refer: false
            },
            solutions: {
                pattern: ["solutions/*.md", "!solutions/index.md"],
                refer: false,
                sortBy: "title"
            },
            products: {
                pattern: ["products/*.md", "!products/index.md"],
                refer: false
            },
            caseStudies: {
                pattern: ["resources/case-studies/*.md", "!resources/case-studies/index.md"],
                sortBy: "date",
                reverse: true
            },
            videos: {
                pattern: ["resources/videos/*.md", "!resources/videos/index.md"],
                sortBy: "date",
                reverse: true
            },
            whitepapers: {
                pattern: ["resources/whitepapers/*.md", "!resources/whitepapers/index.md", "!resources/whitepapers/*-success.md"],
                sortBy: "date",
                reverse: true,
                refer: false
            },
            posts: {
                pattern: ["blog/*.md", "!blog/index.md"],
                sortBy: "date",
                reverse: true
            },
            settings: {
                pattern: ["private/settings.md"],
                refer: false
            }
        })
    );
    // if (process.env.NODE_ENV !== "dev") {
    //     siteBuild.use(
    //         tags({
    //             posts: {
    //                 path: "blog/tags/:tag.html",
    //                 layout: "blog-index.njk",
    //                 pathPage: "blog/tags/:tag/:num/index.html",
    //                 perPage: 5
    //             }
    //         })
    //     )
    // }
    
    siteBuild.use(
        pagination({
            "collections.posts": {
                perPage: 8,
                layout: "blog-index.njk",
                first: "blog/index.html",
                path: "blog/:num/index.html",
                filter: function(page) {
                    return page.private != 'true';
                },
                pageMetadata: {
                    seo:{
                        description:"The latest articles around end-to-end air quality solutions such as clean rooms and retractable enclosures."
                    }
                }
            }
        })
    )
    .use(markdown())
    .use(permalinks({ relative: false }))
    .use(industrial.plugin())
    .use(emailfeed({collection: 'posts', site_url:  process.env.SITE_URL || industrial.siteConfig.siteUrl, template: 'layouts/rss/email-rss.njk'}))
    .use(emailfeed({collection: 'posts', site_url: industrial.siteConfig.siteUrl, destination:'rss.xml'}))
    .use(nav(industrial.siteConfig.navConfigs, industrial.siteConfig.navSettings))
    .use(layouts(templateConfig));
    var searchPattern;
    if (process.env.NODE_ENV === "dev") {
        searchPattern = ['*.html'];
    }else{
        searchPattern = ['**/*.html','!**/tags/**','!**/?/*.html','!404.html','!privacy-policy/*','!terms-conditions/*','!resources/blog/*']
    }
        siteBuild.use(lunr({
            pattern: searchPattern
        }));
        
    siteBuild.use(sitemap({frontmatterIgnore:'exclude_from_sitemap', hostname:industrial.siteConfig.siteUrl, omitIndex: true, xslUrl:'/sitemap.xsl', lastmod:now  }));
if (process.env.NODE_ENV === "dev") {
    siteBuild.use(debugUi.report());
}
siteBuild.use(adjustSitemap.plugin())
siteBuild.build(function(err, files) {
    if (err) {
        console.log("!!!!!", err);
    }

    console.log("Metalsmith finished!",process.env.SITE_URL);
    console.timeEnd('build');
});
