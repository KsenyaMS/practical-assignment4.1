import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Post, PostSchema } from '../entities/comment/schema';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from "../api/comment-service";
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { z } from 'zod';
import { Comment } from '../entities/comment/comment.types';

const css = {
    loadingStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
    },
    noDataStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
    },
    dataWrap: {
        width: '80%',
        height: '40vh',
        border: '2px solid pink',
        boxSizing: 'border-box',
        padding: '10px',
        marginBottom: '20px',
    },
    postBodyStyle: {
        fontSize: '18px',
        marginTop: '30px',
        color: 'gray',
    },
    buttonStyle: {
        position: 'absolute',
        background: 'pink',
        color: 'white',
        width: '120px',
        height: '40px',
        paddingLeft: '10px',
        top: 9,
        right: 20,
    },
}

const columns: GridColDef[] = [
    {
        field: 'name',
        headerName: 'Название',
        flex: 0.5,
    },
    {
        field: 'body',
        headerName: 'Комментарий',
        flex: 2,
        renderCell: (cellParams) => <Tooltip title={cellParams.row.body}>
            <span>{cellParams.row.body}</span>
        </Tooltip>
    },
]

export const PostDetails = () => {
    const [commentList, setCommentList] = useState<Comment[]>([]);

    const [searchParams] = useSearchParams();
    const postId = Number(searchParams.get('postId'));

    const getPostById = async (postId: number) => {
        try {
            const post = await apiClient.get(`/posts/${postId}`);

            await PostSchema.parseAsync(post.data);

            return post;

        }
        catch (err) {
            if (err instanceof z.ZodError) {
                err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
            }
            console.log({ err });

            return { data: undefined };

        }
    }

    const { isLoading, isError, data, error } = useQuery<{ data: Post | undefined }>({
        queryKey: ["query-tutorials"],
        queryFn: async () => await getPostById(postId),
    });

    const getCommentList = async (postId: number) => {
        const commentList = await apiClient.get(`/posts/${postId}/comments`);
        setCommentList(commentList.data);
    }

    useEffect(() => {
        getCommentList(postId);
    }, [])

    return <>
        {isLoading && !data?.data &&
            <Grid sx={css.loadingStyle}>
                <Typography>Данные загружаются...</Typography>
            </Grid>
        }
        {!isLoading && !data?.data &&
            <Grid sx={css.noDataStyle}>
                <Typography>Нет данных для отображения</Typography>
            </Grid>
        }
        {!isLoading && data?.data &&
            <Grid>
                <Grid sx={css.dataWrap}>
                    <Typography sx={{ fontSize: '25px' }}>{data.data.title}</Typography>
                    <Typography sx={css.postBodyStyle}>{data.data.body}</Typography>
                </Grid>
                <Grid
                    sx={{
                        position: 'relative'
                    }}
                >
                    <DataGrid
                        rows={commentList}
                        columns={columns}
                    />
                    <Button
                        sx={css.buttonStyle}
                        onClick={() => getCommentList(postId)}
                    >
                        Обновить
                    </Button>
                </Grid>
            </Grid>
        }
    </>
}