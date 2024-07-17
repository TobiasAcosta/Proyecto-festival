//dependencias de node.js
import path from 'path'; //ubicacion
import fs from 'fs';// file system, nos permite generar la carpeta si es necesario
import {glob} from 'glob';

import {src, dest, watch, series} from 'gulp' // src es una funcion que nos va a permitir acceder a cierto archivos y dest nos va permitir almacenar los archivos una vez procesados
import * as dartSass from 'sass' // importamos todo el contenido de sass y con el as le indicamos cual sera su nombre "dartSass"
import gulpSass from 'gulp-sass' // importamos la dependendia para utilizar sass en el archivo de gulpfile
import terser from 'gulp-terser';//optimiza js
import sharp from 'sharp';//optimiza img

const sass = gulpSass(dartSass);

export function js(done){
    src('src/js/app.js')
        .pipe(terser())
        .pipe(dest('build/js'))
    done();
}

export function css(done) {
    src('src/scss/app.scss', {sourcemaps: true})
        .pipe(sass({
            outputStyle: 'compressed' //optimiza y comprime el codigo css
        }).on('error', sass.logError)) // '.on' es un listener la cual va a estar escuchando a que ocurra algo 'error' si hay un error lo muestra en consola 'logError'
        .pipe(dest('build/css', {sourcemaps: true}))
    done();
}

export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'//busca la galeria
    const outputFolder = 'src/img/gallery/thumb';//genera un folder con imagenes mas pequeñas
    const width = 250;// se ajusta el ancho de las imagenes
    const height = 180;//se ajusta el alto
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}
export async function imagenes(done) {
    const srcDir = 'src/img';
    const buildDir = 'build/img';
    const images =  await glob('src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

export function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
    watch('src/img/**/*.{png,jpg}', imagenes)
}

export default series(crop, js, css, imagenes, dev);