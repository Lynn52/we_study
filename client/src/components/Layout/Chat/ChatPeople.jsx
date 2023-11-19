import { Grid, styled, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import { useEffect, useRef } from "react";

export default function ChatPeople(props) {

    return (
        <Stack>
            {props.data.map(data => {
                return (
                    <Grid container onClick={() => { props.onClickHandler(data.ClassChat.id, data.id, data.ClassChat.title) }} sx={{ cursor: 'pointer', '&:hover': { background: 'rgba(0, 0, 0, 0.1)' } }} >
                        {/* 이 밑은 지금은 icon으로 넣었지만 나중에 profile사진으로 넣을 수 있음 */}
                        <Grid item sx={{ marginLeft: '10px' }} xs={1}>
                            <AccountCircleIcon sx={{
                                fontSize: '30pt',
                            }} />
                        </Grid>
                        <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant='h5' sx={{ alignSelf: 'center', marginLeft: '20px', paddingTop: '3px' }}>{data.ClassChat.title}</Typography>
                        </Grid >
                    </Grid>
                )
            })}
        </Stack>
    )
}