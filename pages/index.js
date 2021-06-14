import Head from 'next/head';
import VideoContainer from '../components/VideoContainer';

import YouTube from 'react-youtube';

import styles from '../styles/Home.module.css';
import styled from 'styled-components';

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = async (url) => {
  let data = await fetch(url);
  data = await data.json();
  return data;
}

export default function Home() {
  const defaultQuery = "VMZ";
  const [query, setQuery] = useState(typeof window !== 'undefined' ? window?.localStorage?.getItem('query') || defaultQuery : defaultQuery);
  const [inputQuery, setInputQuery] = useState(query);
  let {data, err} = useSWR(`/api/youtube?q=${query}`, fetcher)

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  if (err) {return (
    <div className={styles.container}>
      <Head>
        <title>Um erro ocorreu!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Um erro ocorreu...</h1>
    </div>
  );}
  if (!data) return (
    <div className={styles.container}>
      <Head>
        <title>ChaoticDB Fallback - {query}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{width: '100%', height: '100%', margin: '25vh 25vw', display: 'grid', placeItems: 'center'}}>
        <h1 style={{fontSize: '4rem'}}>Carregando...</h1>
      </main>
    </div>
  );

  try {
    return (
      <div className={styles.container}>
        <Head>
          <title>ChaoticDB Fallback - {query}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <InputContainer>
          <input value={inputQuery} onChange={(e) => setInputQuery(e.target.value)} onKeyPress={(e) => {return e.key.toUpperCase() === "ENTER" ? [setQuery(inputQuery), typeof window !== "undefined" ? window?.localStorage?.setItem('query', inputQuery) : null] : null;}}/>
        </InputContainer>
        <YouTube videoId={data[0]['id'] || "2g811Eo7K8U"} opts={opts} onReady={(event) => {console.dir(event.target)}} />
        <main className={styles.main}>
          {data && data.map ? data.map(video => VideoContainer(video)) : "Nenhum vídeo encontrado"}  
        </main>
      </div>
    )
  } catch (err) {
    console.error(err);
    return (
      <div className={styles.container}>
        <Head>
          <title>Um erro ocorreu!</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1>Um erro ocorreu...</h1>
      </div>
    )
  }
}

const InputContainer = styled.div`
  margin: 5rem 0 1rem 0;
  width: 100%;
  display: grid;
  place-items: center;

  input {
    display: grid;
    place-items: center;

    aspect-ratio: 9 / 2;
      width: 300px;
    padding: .25rem;

    font-size: 1rem;

    border-radius: 2vh;
    border: .75vh solid rgba(255, 255, 255, .7);

    outline: none;

    transition: 400ms ease;

    background: black;
    color: orange;

    font-weight: bold;

    :hover {
      border-width: .25vh;

      width: calc(300px * 1.5);
      font-size: 1.45rem;
    }

    :focus {
      border-width: .75vh;
      border-color: orange;
    }
  }
`
