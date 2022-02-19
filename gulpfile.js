const gulp = require("gulp");
const esbuild = require("gulp-esbuild");
const del = require("del");

const html = () => {
    return gulp
      .src('src/index.html')
      .pipe(gulp.dest('dist'))
  }

const scripts = () => {
  return gulp
    .src("src/scripts/index.js")
    .pipe(
      esbuild({
        target: "es2015",
        bundle: true,
        minify: true,
        plugins: [
          {
            name: "node-modules-resolution",
            setup(build) {
              build.onResolve({ filter: /^\// }, (args) => {
                const cwd = process.cwd();
                const newPath = args.path.includes(cwd)
                  ? args.path
                  : path.join(cwd, "node_modules", args.path);

                return {
                  path: newPath,
                };
              });
            },
          },
        ],
      })
    )
    .pipe(gulp.dest("dist/scripts"));
};

// Clean
const clean = () => {
  return del(["dist/styles", "dist/scripts"]);
};

// Cache
const cacheHash = () => {
  return gulp.src("dist/**/*.{css,js}").pipe(gulp.dest("dist"));
};

exports.default = gulp.series(clean, cacheHash, scripts, html);