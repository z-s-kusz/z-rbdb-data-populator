const processTitle = (title) => {
    // remove wiki citations ie '"Hey Jude"[a][b]' to "Hey Jude"
    const regex = /\[[a-zA-Z]\]/g;
    title = title.replaceAll(regex, '').trim();

    // removes quotes around title ie "Hey Jude" to Hey Jude
    title = title.substring(1, title.length - 1);
    return title;
}

const processPackName = (pack) => {
    return pack === 'Single' ? '' : pack;
}

// note to self still missing a portugal the man and a sum 41 song in library
const skipSong = (title, year) => {
    return title === 'Jane' && year === '1979';
}

const getDefaultDifficulty = () => {
    return {
        vocals: -1,
        guitar: -1,
        bass: -1,
        drums: -1,
    };
}

export function tableToJSObjBaseGame($cheerioTableRows) {
    const songs = [];
    // start at index 1 to skip header row that I keep failing to cut off
    for (let i = 1; i < $cheerioTableRows.length; i++) {
        const $row = $cheerioTableRows.eq(i);
        const rawTitle = $row.children('td').eq(0).text().trim();
        const rawArtist = $row.children('td').eq(1).text().trim();
        const rawYear = $row.children('td').eq(2).text().trim();
        const rawGenre = $row.children('td').eq(3).text().trim();
        // console.log(`${rawTitle} by ${rawArtist} | ${rawYear} ${rawGenre}`);

        const song = {
            // id not needed
            title: processTitle(rawTitle),
            artist: rawArtist,
            album: '', // get from spotify???
            year: parseInt(rawYear),
            genres: [],
            primaryGenre: rawGenre,
            owned: true,
            packName: '',
            source: 'RB4',
            owner: 'Zach',
            thank: 'Harmonix',
            harmonies: true,
            packName: '', // TODO add to .ts in app
            rbDifficulty: getDefaultDifficulty(),
            votedDifficulty: getDefaultDifficulty(),
        };
        songs.push(song);
    }
    return songs;
}

export function tableToJSObjDLC($cheerioTableRows) {
    const songs = [];
    // start at index 1 to skip header row that I keep failing to cut off
    for (let i = 1; i < $cheerioTableRows.length; i++) {
        const $row = $cheerioTableRows.eq(i);
        const rawTitle = $row.children('td').eq(0).text().trim();
        const rawArtist = $row.children('td').eq(1).text().trim();
        const rawYear = $row.children('td').eq(2).text().trim();
        const rawGenre = $row.children('td').eq(3).text().trim();
        const rawPackName = $row.children('td').eq(4).text().trim();
        // console.log(`${rawTitle} by ${rawArtist} | ${rawYear} ${rawGenre}`);

        const title = processTitle(rawTitle);
        const year = parseInt(rawYear);
        const packName = processPackName(rawPackName);

        // skip songs already added for testing
        if (skipSong(title, year)) return;

        const song = {
            // id not needed
            title,
            artist: rawArtist,
            album: '',
            year,
            genres: [],
            primaryGenre: rawGenre,
            owned: false,
            source: 'DLC',
            owner: '',
            thank: 'Harmonix',
            harmonies: false,
            packName, // TODO add to .ts in app
            rbDifficulty: getDefaultDifficulty(),
            votedDifficulty: getDefaultDifficulty(),
        };
        songs.push(song);
    }

    return songs;
}
