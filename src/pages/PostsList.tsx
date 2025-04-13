import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Post } from '../entities/comment/schema';
import { Link } from 'react-router-dom';

const columns: GridColDef[] = [
    {
        field: 'title',
        headerName: 'Название',
        flex: 2,
    },
    {
        field: 'actions',
        headerName: '',
        flex: 1,
        renderCell: (cellParams) => <Link to={`/comment?postId=${cellParams.row.id}`}>Перейти</Link>
    },
]

export const PostsList = () => {
    const [postList, setPostList] = useState<Post[]>([]);

    const getCommentList = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const posts = await response.json();
            setPostList(posts);
        }
        catch (e) {
            console.log({ e });

        }
    }

    useEffect(() => {
        getCommentList();
    }, [])

    return <DataGrid
        rows={postList}
        columns={columns}
    />
}