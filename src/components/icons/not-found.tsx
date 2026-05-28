import Image from "next/image";

const NotFoundIcon = ({ ...props }) => {
	return (
		<Image
			src="/not-found.svg"
			className="w-full h-full object-contain"
			alt="Not Found"
			width={300}
			height={300}
			{...props}
		/>
	);
};

export default NotFoundIcon;
