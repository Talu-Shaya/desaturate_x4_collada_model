var fs = require('fs');
const chalk = require('chalk');
const { match } = require('assert');

let filename = 'engine_navy_issue_m_allround_01_body.dae';
fs.readFile(filename, 'utf8', function(err, contents)
{
    const regex = /(<float_array id="(.*color.*?)".+>)(.*?)(<\/float_array.*>)/gm;
    let output = contents.replace(regex, process_color_block);
    if (!fs.existsSync('grey')) fs.mkdirSync('grey');
    fs.writeFileSync('grey/' + filename, output);
    console.log('Done.');
});

function process_color_block(fullMatch, ...matches)
{
    let output = '';
    var colors = matches[2].split(' ').filter((el) => { return el != ''; });
    for (let i = 0; i < colors.length; i+=3)
    {
        let r = parseFloat(colors[i]);
        let g = parseFloat(colors[i + 1]);
        let b = parseFloat(colors[i + 2]);
        let l = 0.5 * (0.22 * r + 0.72 * g + 0.06 * b).toFixed(6);
        let append_rgb = r + ' ' + g + ' ' + b + ' ';
        let append_lum = l + ' ' + l + ' ' + l + ' ';
        //if blueish, desaturate
        if (r < g && r < b)
        {
            output += append_lum;
            //console.log(chalk.rgb(parseInt(r*255), parseInt(g*255), parseInt(b*255))(append_rgb) + '- ' + chalk.rgb(parseInt(l*255), parseInt(l*255), parseInt(l*255))(append_lum));
        }
        else
        {
            output += append_rgb;
            //console.log(chalk.rgb(parseInt(r*255), parseInt(g*255), parseInt(b*255))(append_rgb) + '- ' + chalk.rgb(parseInt(r*255), parseInt(g*255), parseInt(b*255))(append_rgb));
        }
    }
    console.log('Found mesh "' + matches[1] + '": ' + colors.length + ' vertices.');
    return matches[0] + output + matches[3];
}