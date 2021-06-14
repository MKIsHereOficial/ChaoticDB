import styled from 'styled-components';

export default function VideoContainer(video = {title, url, channel: {name, url}, thumbnail: {url}}) {


  console.log(video);

  return (
    <Container>
      <Thumbnail src={video.thumbnail.url} href={video.url} />
      <Title><a href={video.url}>{video.title}</a></Title>
    </Container>
  )
}

  
const Container = styled.div`
  min-width: 300px;
  width: 533.328px;
  height: 300px;

  border-radius: .75rem;

  background: rgba(187, 187, 187, .2);
  backdrop-filter: blur(10px);

  padding: 6vw;

  display: grid;
  place-items: center;

  position: relative;
  z-index: 3;

  transition: transform 300ms ease;

  
  :hover {
    transform: scale(1.2);

    z-index: 4;
  }
`;

const Title = styled.h1`
  z-index: 2;
  color: #bbb;

  position: absolute;
  top: .45rem;

  max-width: 100%;
  text-align: center;

  margin: 0 .25rem;
`;

const ThumbnailImage = styled.img`
  aspect-ratio: 16 / 9;
  height: 300px;
  min-width: 300px;
  object-fit: cover;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 1;

  user-select: none;
  -webkit-user-drag: none;

  border-radius: 2vh;
  border: .75vh solid rgba(255, 255, 255, .5);

`;

const Thumbnail = (props = {src, href}) => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer" >
      <ThumbnailImage src={props.src} alt={props.href} />
    </a>
  )
}
