import { useEffect, useState } from "react";
import { Card, FormField, Loader } from "../components";
import { Link } from "react-router-dom";

const RenderCards = ({ data, title }) => {
	if (data?.length > 0) {
		return data.map((post) => <Card key={post._id} {...post} />);
	}

	return (
		<h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">
			{title}
		</h2>
	);
};

const Home = () => {
	const [loading, setLoading] = useState(false);
	const [allPosts, setAllPosts] = useState(null);

	const [searchText, setSearchText] = useState("");
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [searchedResults, setSearchedResults] = useState(null);

	const [scrolled, setScrolled] = useState(false);

	const fetchPosts = async () => {
		setLoading(true);

		try {
			const response = await fetch(import.meta.env.VITE_SERVER_POST, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
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

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (scrollTop > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleSearchChange = (e) => {
		clearTimeout(searchTimeout);
		setSearchText(e.target.value);

		setSearchTimeout(
			setTimeout(() => {
				const searchResult = allPosts.filter(
					(item) =>
						item.name
							.toLowerCase()
							.includes(searchText.toLowerCase()) ||
						item.prompt
							.toLowerCase()
							.includes(searchText.toLowerCase())
				);
				setSearchedResults(searchResult);
			}, 500)
		);
	};

	return (
		<>
			<header
				className={`fixed top-0 w-full flex justify-between items-center bg-black px-2 sm:px-4 border-b border-b-[#e6ebf4] z-20 ${
					scrolled ? "bg_green_gradient cursor-pointer" : "bg-black"
				}`}
				onClick={() => {
					window.scrollTo(0, 0);
				}}
			>
				<Link
					to="/"
					className="font-inter font-medium bg-[#0fa47f] text-white text-center w-24 py-4 my-2 rounded-md hover:text-black"
				>
					Browse
				</Link>

				<Link
					to="/create-post"
					className="font-inter font-medium bg-[#0fa47f] text-white text-center w-24 py-4 my-2 rounded-md hover:text-black"
				>
					Generate
				</Link>
				<span className="absolute left-1/2 transform -translate-x-1/2 font-inter font-medium text-white">
					Browse
				</span>
			</header>
			<section className="max-w-7xl mx-auto pt-20">
				<div className="flex justify-center items-center flex-col text-center">
					<h1 className="font-extrabold text-white text-[32px]">
						The latest in AI Generated Art
					</h1>
					<p className="mt-2 text-white text-[14px] max-w-[500px]">
						Browse, download, create, and share a collection of
						beautifully crafted AI images by you and the community!
					</p>
				</div>

				<div className="mt-8">
					<FormField
						labelName="Search collection:"
						type="text"
						name="text"
						placeholder="Search by prompt..."
						value={searchText}
						handleChange={handleSearchChange}
					/>
				</div>

				<div className="mt-10">
					{loading ? (
						<div className="flex justify-center items-center flex-col mt-8">
							<p className=" mt-2 text-[#b0aeae] text-[14px]">
								** Due to site inactivity from free hosting on
								Render, server will need some time to spin back
								up **
							</p>
							<div className="mt-8">
								<Loader />
							</div>
						</div>
					) : (
						<>
							{searchText && (
								<h2 className="font-medium text-white text-xl mb-3">
									Showing Resuls for{" "}
									<span className="text-white">
										{searchText}
									</span>
									:
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
		</>
	);
};

export default Home;
