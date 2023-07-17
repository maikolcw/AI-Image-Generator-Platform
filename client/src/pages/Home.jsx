import React, { useEffect, useState } from 'react';

import { Card, FormField, Loader } from '../components';

const RenderCards = ({ data, title }) => {
    if (data?.length > 0) {
        return (
            data.map((post) => <Card key={post._id} {...post} />)
        );
    }

    return (
        <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
    );
};

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);

        try {
            const response = await fetch(import.meta.env.VITE_SERVER_POST, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setAllPosts(result.data.reverse());
            }
        } catch (err) {
            alert(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        setSearchTimeout(
            setTimeout(() => {
                const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
                setSearchedResults(searchResult);
            }, 500),
        );
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-white text-[32px]">A Showcase of DALL-E AI Generated Art</h1>
                <p className="mt-2 text-white text-[14px] max-w-[500px]">Browse, download, create, and share a collection of beautifully crafted AI images by you and the community!</p>
            </div>

            <div className="mt-8">
                <FormField
                    labelName="Search collection:"
                    type="text"
                    name="text"
                    placeholder="Search prompt..."
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <p className="mt-2 text-[#b0aeae] text-[14px]">** Due to site inactivity on Render.com, server might need some time to spin back up **</p>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className="font-medium text-white text-xl mb-3">
                                Showing Resuls for <span className="text-white">{searchText}</span>:
                            </h2>
                        )}
                        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                <RenderCards
                                    data={searchedResults}
                                    title="No Search Results Found"
                                />
                            ) : (
                                <RenderCards
                                    data={allPosts}
                                    title="No Posts Yet"
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Home;