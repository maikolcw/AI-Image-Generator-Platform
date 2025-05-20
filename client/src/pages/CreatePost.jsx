import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { smiley } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import { Link } from "react-router-dom";

const CreatePost = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: "",
		prompt: "",
		photo: "",
	});

	const [generatingImg, setGeneratingImg] = useState(false);
	const [loading, setLoading] = useState(false);

    const [scrolled, setScrolled] = useState(false);

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

	const generateImage = async () => {
		if (form.prompt) {
			try {
				setGeneratingImg(true);
				const response = await fetch(
					import.meta.env.VITE_SERVER_DALLE,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							prompt: form.prompt,
						}),
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || "Something went wrong");
				}

				const data = await response.json();
				setForm({
					...form,
					photo: `data:image/jpeg;base64,${data.photo}`,
				});
			} catch (err) {
				alert(err.message);
			} finally {
				setGeneratingImg(false);
			}
		} else {
			alert("Please provide proper prompt");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (form.prompt && form.photo) {
			setLoading(true);
			try {
				const response = await fetch(import.meta.env.VITE_SERVER_POST, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ ...form }),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || "Something went wrong");
				}

				await response.json();
				alert("Success");
				navigate("/");
			} catch (err) {
				alert(err.message);
			} finally {
				setLoading(false);
			}
		} else {
			alert("Please generate an image with proper details");
		}
	};

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSurpriseMe = () => {
		const randomPrompt = getRandomPrompt(form.prompt);
		setForm({ ...form, prompt: randomPrompt });
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
					Generate
				</span>
			</header>
			<section className="max-w-7xl mx-auto pt-20 pb-4">
				<div className="flex justify-center items-center flex-col text-center">
					<h1 className="font-extrabold text-white text-[32px]">
						Create
					</h1>
					<p className="mt-2 text-white text-[14px] max-w-[500px]">
						Generate beautiful and visually striking images through
						DALL-E AI and share it with the community!
					</p>
				</div>

				<form className="mt-8" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-5">
						<FormField
							labelName="User:"
							type="text"
							name="name"
							placeholder="John Wick"
							value={form.name}
							handleChange={handleChange}
						/>

						<FormField
							labelName="Prompt:"
							type="text"
							name="prompt"
							placeholder="Elegant elven archer stands poised in sunlit, flower-filled meadow"
							value={form.prompt}
							handleChange={handleChange}
							isSurpriseMe
							handleSurpriseMe={handleSurpriseMe}
						/>

						<div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center mx-auto sm:mx-0">
							{form.photo ? (
								<img
									src={form.photo}
									alt={form.prompt}
									className="w-full h-full object-contain"
								/>
							) : (
								<img
									src={smiley}
									alt="preview"
									className="w-9/12 h-9/12 object-contain opacity-40"
								/>
							)}

							{generatingImg && (
								<div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
									<Loader />
								</div>
							)}
						</div>
					</div>

					<div className="mt-5 flex gap-5">
						<button
							type="button"
							onClick={generateImage}
							className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
						>
							{generatingImg ? "Generating..." : "Generate"}
						</button>
					</div>

					<div className="mt-1">
						<button
							type="submit"
							className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
						>
							{loading ? "Adding..." : "Share with browse collection"}
						</button>
					</div>
				</form>
			</section>
		</>
	);
};

export default CreatePost;
