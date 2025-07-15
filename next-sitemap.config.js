/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  // !STARTERCONF Change the siteUrl
  /** TODO: This siteUrl will be added once the production domain is ready*/
  siteUrl: '',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
