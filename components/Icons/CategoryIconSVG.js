import React from "react";
import Svg, { Path, G, ClipPath, Defs } from "react-native-svg";

function CategoryIconSVG({ category, props }) {
  function renderIcon() {
    switch (category) {
      case "Clothes":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M17.494 11.273h2.464a.718.718 0 0 0 .645-.4l1.673-3.346a.737.737 0 0 0-.291-.963L17.495 4M5.858 11.273H3.395a.718.718 0 0 1-.646-.4L1.076 7.527a.736.736 0 0 1 .291-.963L5.858 4"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M14.586 4a2.909 2.909 0 1 1-5.819 0H5.858v15.273a.727.727 0 0 0 .728.727h10.181a.727.727 0 0 0 .728-.727V4h-2.91Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Electronics":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="m12 16.01.01-.011"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7 19.4V4.6a.6.6 0 0 1 .6-.6h8.8a.6.6 0 0 1 .6.6v14.8a.6.6 0 0 1-.6.6H7.6a.6.6 0 0 1-.6-.6Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
            />
          </Svg>
        );
      case "Free Goods":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M20 12v9.4a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6V12M21.4 7H2.6a.6.6 0 0 0-.6.6v3.8a.6.6 0 0 0 .6.6h18.8a.6.6 0 0 0 .6-.6V7.6a.6.6 0 0 0-.6-.6ZM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Health & beaty":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.55 12.225c-.564 0-.975.364-1.206.744-.235.386-.344.862-.344 1.319v6.487c0 .414.336.75.75.75h8a.75.75 0 0 0 .75-.75v-6.487c0-.457-.109-.933-.344-1.319-.231-.38-.642-.744-1.206-.744h-6.4Zm6.45 7.8v-5.737a1.083 1.083 0 0 0-.141-.563H8.64a1.083 1.083 0 0 0-.141.563v5.737H15Z"
              fill="#4D4D4D"
            />
            <Path
              d="M14.75 12.757v-2.666c0-.29-.063-.567-.176-.771-.112-.205-.265-.32-.424-.32h-4.8c-.16 0-.312.115-.424.32a1.643 1.643 0 0 0-.176.77v2.667"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9.75 9V3.944l4-1.944v7"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Hobbies & sports":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M17.737 20.192c4.524-3.167 5.623-9.403 2.455-13.927C17.025 1.741 10.79.642 6.265 3.81 1.741 6.977.642 13.213 3.81 17.737c3.168 4.524 9.403 5.623 13.928 2.455ZM17.737 20.193 6.266 3.81"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19.578 5.474c-3.77 5.896-8.508 9.213-16.302 11.415"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M13.06 2.057c.414 5.24 3.393 9.494 8.647 12.35M2.294 9.596c4.782 2.18 7.761 6.434 8.647 12.349"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Home":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <G
              clipPath="url(#a)"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M20.25 20.25v-9.422a.778.778 0 0 0-.244-.553l-7.5-6.816a.75.75 0 0 0-1.012 0l-7.5 6.816a.777.777 0 0 0-.244.553v9.422M1.5 20.25h21" />
              <Path d="M14.25 20.25V15a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v5.25" />
            </G>
            <Defs>
              <ClipPath id="a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
              </ClipPath>
            </Defs>
          </Svg>
        );
      case "Kids":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M10.5 3a8.5 8.5 0 0 0-7.212 13M17.713 16A8.46 8.46 0 0 0 19 11.5v-2h2.5M7 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM14 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM10.5 3v9M2.5 12h16"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Office goods":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M2 11h20M2 11V4.6a.6.6 0 0 1 .6-.6h6.178a.6.6 0 0 1 .39.144l3.164 2.712a.6.6 0 0 0 .39.144H21.4a.6.6 0 0 1 .6.6V11H2Zm0 0v8.4a.6.6 0 0 0 .6.6h18.8a.6.6 0 0 0 .6-.6V11H2Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Outdoor & garden":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M6.367 20.3s.5-4.5 4-8.5"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="m18.497 3.543.595 6.174c.374 3.886-2.54 7.346-6.425 7.72-3.813.367-7.267-2.42-7.635-6.233a6.936 6.936 0 0 1 6.24-7.568l6.57-.633a.6.6 0 0 1 .655.54Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Pets":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M11.501 17.166V20"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7.917 12.562a.313.313 0 1 1-.625 0 .313.313 0 0 1 .625 0ZM15.71 12.562a.313.313 0 1 1-.625 0 .313.313 0 0 1 .625 0Z"
              fill="#000"
              stroke="#4D4D4D"
              strokeWidth={1.5}
            />
            <Path
              d="M11.501 4.415v3.542M12.918 15.75 11.5 17.165l-1.417-1.417M8.667 4.858v3.1M14.335 4.858v3.1"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M3 12.207v-7.5a.708.708 0 0 1 1.213-.496l1.94 1.94A8.926 8.926 0 0 1 11.5 4.415a8.926 8.926 0 0 1 5.348 1.736v0l1.94-1.94a.708.708 0 0 1 1.213.496v7.5c0 4.304-3.808 7.793-8.501 7.793S3 16.511 3 12.207Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Toys & games":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M14.143 9.668h2.856M7.002 9.668h2.856M8.43 8.24v2.856M15.927 5l-7.854.027a4.65 4.65 0 0 0-4.57 3.838v0L2.039 16.37a2.5 2.5 0 0 0 4.23 2.205v0l3.857-4.267 5.801-.026a4.641 4.641 0 0 0 0-9.283v0Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="m20.498 8.838 1.463 7.533a2.5 2.5 0 0 1-4.23 2.205v0l-3.856-4.285"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "Vehicles":
        return (
          <Svg
            width={24}
            height={24}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <Path
              d="M8 10h8M7 14h1M16 14h1"
              stroke="#4D4D4D"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7 18h10M3 18v-6.59a2 2 0 0 1 .162-.787l2.319-5.41A2 2 0 0 1 7.319 4h9.362a2 2 0 0 1 1.838 1.212l2.32 5.41a2 2 0 0 1 .161.789V18H3Zm0 0v2.4a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V18H3Zm0 0h4-4Zm18 0v2.4a.6.6 0 0 1-.6.6h-2.8a.6.6 0 0 1-.6-.6V18h4Zm0 0h-4 4Z"
              stroke="#4D4D4D"
              strokeWidth={1.5}
            />
          </Svg>
        );
    }
  }

  return renderIcon();
}

export default CategoryIconSVG;
