import { frames } from '../../frames/frames';
import fetchRound from '../../../lib/fetchRound'

import { Button } from "frames.js/next";

const handleRequest = frames(async (c) => {

    const { buttonValue, status, deriveState } = c
  const url = new URL(c.req.url);
  const id = url.searchParams.get("id");

  const state: any = deriveState((previousState: any) => {
    if(previousState.id === 0) previousState.id = id ?? 20
    if(buttonValue === "inc") previousState.projectId++
    if (buttonValue === 'dec') previousState.projectId--
  })

  const round = await fetchRound(`${id}`, 42161)
  //const title = round.data?.rounds[0].applications[0].project.metadata.title || `Project ${state.projectId}`
  return {
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {state.projectId === 0 ? `View projects in ${round.data?.rounds[0].roundMetadata.name}` : `Project ${state.projectId}`}
        </div>
      </div>
    ),
    intents: state.projectId === 0 ? [
      <>
      <Button
        action='link'
        target={`https://explorer.gitcoin.co/#/round/42161/${id || state.id}`}>
          View Round
      </Button>
      <Button action="post_redirect" value="inc">View Projects</Button>,
      </>
    ] : [
      <Button action="link" target={`https://explorer.gitcoin.co/#/round/42161/${id || state.id}/${state.projectId}`}>Donate to Project</Button.Redirect>,
      <Button value="inc">Next</Button>,
      <Button value="dec">Back</Button>
    ]
  });

export const GET = handleRequest;
export const POST = handleRequest;
