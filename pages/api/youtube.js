import yts from 'ytsr'

const oldVersion = async (req, res) => {
  try {
    const query = req.query['q'] || req.query['query'] || "VMZ";

    let videos = `https://youtube.googleapis.com/youtube/v3/search?part=id&part=snippet&maxResults=${10}&q=${query}&type=video&key=${API_KEY}`;
    videos = await fetch(videos);

    const isOk = videos.ok;

    console.dir(videos);

    videos = await videos.json();


    if (!isOk || videos.err || videos.error) throw videos.err || videos.error;


    videos = videos['items'];

    videos = videos && videos.map ? videos.map(video => {
      let obj = {
        key: video['etag'],
        id: video['id']['videoId'],
        title: video['snippet']['title'],
        description: video['snippet']['description'],
        url: `https://www.youtube.com/watch?v=${video['id']['videoId']}`,
        channel: {
          id: video['snippet']['channelId'], 
          name: video['snippet']['channelTitle'], 
          url: `https://www.youtube.com/channel/${video['snippet']['channelId']}`
        },
        thumbnail: video['snippet']['thumbnails']['high'],
        publishedAt: video['snippet']['publishedAt']
      };

      return obj;
    }) : videos;

    res.status(200).json(videos)
  } catch (err) {
    console.error(err);
    res.status(err.status || err.code || err.statusCode || 500).json({err: err.message || "Internal Server Error"});
  }
}

const newVersion = async (req, res) => {
  try {
    const options = {
      limit: 20,
      gl: 'BR',
      hl: 'pt',
      pages: 1,
    }
    const query = req.query['q'] || req.query['query'] || "VMZ";

    let videos = await yts(query, options);
    
    videos = videos['items'];

    let final = [];

    videos && videos.map ? videos.map(video => {
      if (video['type'] === "video") {
        let obj = {
          key: video['id'],
          id: video['id'],
          title: video['title'],
          description: video['description'],
          views: video['views'],
          url: `https://www.youtube.com/watch?v=${video['id']}`,
          channel: {
            verified: video['author']['verified'],
            id: video['author']['channelId'], 
            name: video['author']['name'], 
            url: video['author']['url'] || `https://www.youtube.com/channel/${video['author']['channelId']}`,
            avatar: video['author']['bestAvatar'],
          },
          thumbnail: video['bestThumbnail'],
          publishedAt: video['uploadedAt'],
          duration: {toString: () => {return video['duration']}, seconds: video['duration'].split(':').reduce((acc,time) => (60 * acc) + +time)}
        };

        final.push(obj);
      }
    }) : null;

    videos = final;

    res.status(200).json(videos);
  } catch(err) {
    console.error(err);
    res.status(err.status || err.code || err.statusCode || 500).json({err: err.message || "Internal Server Error"});
  }
}

export default newVersion;
