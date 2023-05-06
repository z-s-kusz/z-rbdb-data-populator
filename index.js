import * as cheerio from "cheerio";
import axios from "axios";
import { tableToJSObjBaseGame, tableToJSObjDLC } from "./table-to-js-obj.js";
import { bulkAddData } from "./firebase.js";

const urls = {
    rb4Base: 'https://en.wikipedia.org/wiki/List_of_songs_in_Rock_Band_4',
    rivals: '', // mmmm nah
    // dlc2023Wiki as of May 7 2023
    dlc: [
        'https://en.wikipedia.org/wiki/2015_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2016_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2017_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2018_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2019_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2020_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2021_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2022_in_downloadable_songs_for_the_Rock_Band_series',
        'https://en.wikipedia.org/wiki/2023_in_downloadable_songs_for_the_Rock_Band_series',
    ],
};

const addBaseGame = () => {
    axios.get(urls.rb4Base)
    .then((response) => {
        const doc = response.data;
        const $ = cheerio.load(doc);

        // first table is the base game song list
        // no matter how I select/traverse I get the table header row back in the tbody
        // so I'm just explicitly including it here
        const $songsTable = $('table:first').find('tr');
        const songs = tableToJSObjBaseGame($songsTable);


        /* comment next line back in to send it up to the firestroe database! */
        // bulkAddData(songs, urls.rb4Base);
    })
    .catch((error) => {
        console.error('error in get request', error);
    });
}

const addDLC = () => {
    urls.dlc.forEach((dlcUrl, i) => {
        axios.get(dlcUrl)
            .then((response) => {
                const doc = response.data;
                const $ = cheerio.load(doc);

                // songs table is 2nd on the page
                // same theader issue even when only accessing tbody so skip 1st index when processing
                const $songsTable = $('table:eq(1)').find('tr');
                const songs = tableToJSObjDLC($songsTable);

                /* comment next line back in to send it up to the firestroe database! */
                // bulkAddData(songs, dlcUrl);
            })
            .catch((error) => {
                console.log(dlcUrl);
                console.error('error in get request', error);
            });
    });
}

addBaseGame();
addDLC();
