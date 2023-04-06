const CopyPlugin = require("copy-webpack-plugin");
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const defaultConfig = {
  reactStrictMode: false,
  swcMinify: false,
  images: {
    domains: [
      "tailwindui.com",
      "court.test",
      "courtbox.dev"
    ]
  },
  env: {
    ASSEMBLY_KEY: process.env.ASSEMBLY_KEY
  },
  // webpack: (config, options) => {
  //   config.plugins.push(
  //     new CopyPlugin({
  //       patterns: [
  //         {
  //           from: "./node_modules/@pdftron/webviewer/public",
  //           to: "webviewer",
  //         },
  //       ],
  //     })
  //   )
  //   return config;
  // },
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
]);

module.exports = withSentryConfig(
  withTM(defaultConfig), sentryWebpackPluginOptions
);
