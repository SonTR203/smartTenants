import React from "react";
import Svg, { Path } from "react-native-svg";

function CategoryIconSVG({ category }) {
  function renderIcon() {
    switch (category) {
      case "Clothes":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M17.4941 11.2727H19.9578C20.092 11.273 20.2236 11.2357 20.3377 11.165C20.4518 11.0943 20.5438 10.9931 20.6032 10.8727L22.276 7.52727C22.3588 7.35973 22.3749 7.16693 22.3209 6.98799C22.2668 6.80904 22.1468 6.65734 21.985 6.56364L17.4941 4"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M5.85815 11.2727H3.39451C3.26029 11.273 3.12868 11.2357 3.01459 11.165C2.90051 11.0943 2.80852 10.9931 2.74906 10.8727L1.07633 7.52727C0.993455 7.35973 0.977402 7.16693 1.03142 6.98799C1.08544 6.80904 1.2055 6.65734 1.36724 6.56364L5.85815 4"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M14.5857 4C14.5857 4.77154 14.2792 5.51148 13.7336 6.05704C13.1881 6.6026 12.4481 6.90909 11.6766 6.90909C10.905 6.90909 10.1651 6.6026 9.61954 6.05704C9.07398 5.51148 8.76749 4.77154 8.76749 4H5.8584V19.2727C5.8584 19.4656 5.93502 19.6506 6.07141 19.787C6.2078 19.9234 6.39279 20 6.58567 20H16.7675C16.9604 20 17.1454 19.9234 17.2817 19.787C17.4181 19.6506 17.4948 19.4656 17.4948 19.2727V4H14.5857Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Electronics":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M12 16.0101L12.01 15.999"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7 19.4V4.6C7 4.26863 7.26863 4 7.6 4H16.4C16.7314 4 17 4.26863 17 4.6V19.4C17 19.7314 16.7314 20 16.4 20H7.6C7.26863 20 7 19.7314 7 19.4Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
            />
          </Svg>
        );
      case "Free Goods":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M20 12V21.4C20 21.7314 19.7314 22 19.4 22H4.6C4.26863 22 4 21.7314 4 21.4V12"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M21.4 7H2.6C2.26863 7 2 7.26863 2 7.6V11.4C2 11.7314 2.26863 12 2.6 12H21.4C21.7314 12 22 11.7314 22 11.4V7.6C22 7.26863 21.7314 7 21.4 7Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M12 22V7"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Health & beaty":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.55 12.2251C7.986 12.2251 7.57537 12.5894 7.34387 12.9693C7.10859 13.3554 7 13.8307 7 14.2879V20.7751C7 21.1893 7.33579 21.5251 7.75 21.5251C7.7504 21.5251 7.75081 21.5251 7.75121 21.5251H15.7488C15.7492 21.5251 15.7496 21.5251 15.75 21.5251C16.1642 21.5251 16.5 21.1893 16.5 20.7751V14.2879C16.5 13.8307 16.3914 13.3554 16.1561 12.9693C15.9246 12.5894 15.514 12.2251 14.95 12.2251H8.55ZM15 20.0251V14.2879C15 14.0487 14.94 13.8562 14.8752 13.7499C14.8693 13.7402 14.8639 13.732 14.8589 13.7251H8.64105C8.63614 13.732 8.63067 13.7402 8.62476 13.7499C8.55998 13.8562 8.5 14.0487 8.5 14.2879V20.0251H15Z"
              fill="#4D4D4D"
            />
            <Path
              d="M14.75 12.7572V10.0909C14.75 9.80158 14.6868 9.5241 14.5743 9.31952C14.4617 9.11493 14.3091 9 14.15 9H9.35C9.19087 9 9.03826 9.11493 8.92574 9.31952C8.81321 9.5241 8.75 9.80158 8.75 10.0909V12.7572"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M9.75 9V3.94444L13.75 2V9"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Hobbies & sports":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M17.7366 20.1924C22.2606 17.0246 23.3601 10.7892 20.1923 6.26509C17.0246 1.74104 10.7891 0.641561 6.26509 3.80934C1.74104 6.97711 0.641561 13.2126 3.80934 17.7366C6.97711 22.2607 13.2125 23.3602 17.7366 20.1924Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M17.7372 20.1926L6.26562 3.80957"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M19.5785 5.47412C15.8077 11.3699 11.0701 14.6873 3.27637 16.889"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M13.0605 2.05713C13.474 7.29695 16.4525 11.5509 21.7073 14.4061"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M2.29395 9.5957C7.07632 11.7765 10.055 16.0302 10.9408 21.9447"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Home":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M20.25 20.25V10.8281C20.2483 10.7243 20.2259 10.6219 20.184 10.5269C20.1422 10.4319 20.0817 10.3462 20.0062 10.275L12.5062 3.45933C12.368 3.33284 12.1874 3.2627 12 3.2627C11.8126 3.2627 11.632 3.33284 11.4937 3.45933L3.99375 10.275C3.91828 10.3462 3.85783 10.4319 3.81597 10.5269C3.77411 10.6219 3.75168 10.7243 3.75 10.8281V20.25"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M1.5 20.25H22.5"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M14.25 20.25V15C14.25 14.8011 14.171 14.6103 14.0303 14.4697C13.8897 14.329 13.6989 14.25 13.5 14.25H10.5C10.3011 14.25 10.1103 14.329 9.96967 14.4697C9.82902 14.6103 9.75 14.8011 9.75 15V20.25"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Kids":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M10.5 3C5.80558 3 2 6.80558 2 11.5C2 13.1526 2.4716 14.695 3.28755 16"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M17.7129 16C18.5288 14.695 19.0004 13.1526 19.0004 11.5V9.5H21.5004"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19C9 20.1046 8.10457 21 7 21Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M14 21C12.8954 21 12 20.1046 12 19C12 17.8954 12.8954 17 14 17C15.1046 17 16 17.8954 16 19C16 20.1046 15.1046 21 14 21Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M10.5 3V12"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M2.5 12H18.5"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Office goods":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M2 11H22M2 11V4.6C2 4.26863 2.26863 4 2.6 4H8.77805C8.92127 4 9.05977 4.05124 9.16852 4.14445L12.3315 6.85555C12.4402 6.94876 12.5787 7 12.722 7H21.4C21.7314 7 22 7.26863 22 7.6V11H2ZM2 11V19.4C2 19.7314 2.26863 20 2.6 20H21.4C21.7314 20 22 19.7314 22 19.4V11H2Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Outdoor & garden":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M6.36719 20.3003C6.36719 20.3003 6.86719 15.8003 10.3672 11.8003"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M18.4973 3.54254L19.0919 9.717C19.466 13.6029 16.5525 17.0629 12.6665 17.437C8.85365 17.8042 5.39956 15.0171 5.03242 11.2042C4.66528 7.39129 7.45863 4.00267 11.2715 3.63553L17.8426 3.00281C18.1724 2.97104 18.4656 3.21269 18.4973 3.54254Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Pets":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M11.501 17.1665V20.0001"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7.91722 12.5616C7.91722 12.7343 7.77726 12.8742 7.60461 12.8742C7.43195 12.8742 7.29199 12.7343 7.29199 12.5616C7.29199 12.389 7.43195 12.249 7.60461 12.249C7.77726 12.249 7.91722 12.389 7.91722 12.5616Z"
              fill="#4d4d4d"
              stroke="#4D4D4D"
              stroke-width="1.5"
            />
            <Path
              d="M15.7102 12.5616C15.7102 12.7343 15.5702 12.8742 15.3976 12.8742C15.2249 12.8742 15.085 12.7343 15.085 12.5616C15.085 12.389 15.2249 12.249 15.3976 12.249C15.5702 12.249 15.7102 12.389 15.7102 12.5616Z"
              fill="#4d4d4d"
              stroke="#4D4D4D"
              stroke-width="1.5"
            />
            <Path
              d="M11.501 4.41504V7.95708"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M12.9176 15.7495L11.5008 17.1663L10.084 15.7495"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M8.66699 4.85791V7.9572"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M14.335 4.85791V7.9572"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M3 12.2075V4.70723C3.00023 4.56675 3.04223 4.42952 3.12064 4.31297C3.19905 4.19642 3.31034 4.10582 3.44037 4.05267C3.5704 3.99952 3.71329 3.98622 3.85089 4.01448C3.98849 4.04273 4.11459 4.11125 4.21315 4.21134L6.15242 6.15061C7.7017 5.01096 9.57765 4.40221 11.5009 4.41501C13.4242 4.40221 15.3001 5.01096 16.8494 6.15061V6.15061L18.7887 4.21134C18.8872 4.11125 19.0133 4.04273 19.1509 4.01448C19.2885 3.98622 19.4314 3.99952 19.5614 4.05267C19.6915 4.10582 19.8028 4.19642 19.8812 4.31297C19.9596 4.42952 20.0016 4.56675 20.0018 4.70723V12.2075C20.0018 16.5111 16.1941 20 11.5009 20C6.8077 20 3 16.5111 3 12.2075Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Toys & games":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M14.1426 9.66797H16.9987"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7.00195 9.66797H9.85809"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M8.42969 8.23975V11.0959"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M15.9272 5L8.07283 5.02678C6.98191 5.02885 5.92645 5.41441 5.09106 6.116C4.25567 6.8176 3.69355 7.79056 3.503 8.86472V8.86472L2.03923 16.371C1.94524 16.8952 2.02116 17.4357 2.25591 17.9137C2.49066 18.3917 2.87197 18.7822 3.34423 19.0283C3.8165 19.2744 4.35504 19.3632 4.88132 19.2818C5.40759 19.2004 5.8941 18.9529 6.26989 18.5756V18.5756L10.1257 14.3092L15.9272 14.2825C17.1581 14.2825 18.3387 13.7935 19.2091 12.9231C20.0795 12.0527 20.5684 10.8722 20.5684 9.64123C20.5684 8.4103 20.0795 7.22978 19.2091 6.35938C18.3387 5.48899 17.1581 5 15.9272 5V5Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M20.4977 8.83789L21.9614 16.371C22.0554 16.8951 21.9795 17.4356 21.7448 17.9137C21.51 18.3917 21.1287 18.7822 20.6564 19.0283C20.1842 19.2744 19.6456 19.3632 19.1194 19.2817C18.5931 19.2003 18.1066 18.9529 17.7308 18.5755V18.5755L13.875 14.2913"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        );
      case "Vehicles":
        return (
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M8 10H16"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7 14H8"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M16 14H17"
              stroke="#4D4D4D"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7 18H17M3 18V11.4105C3 11.1397 3.05502 10.8716 3.16171 10.6227L5.4805 5.21216C5.79566 4.47679 6.51874 4 7.31879 4H16.6812C17.4813 4 18.2043 4.47679 18.5195 5.21216L20.8383 10.6227C20.945 10.8716 21 11.1397 21 11.4105V18H3ZM3 18V20.4C3 20.7314 3.26863 21 3.6 21H6.4C6.73137 21 7 20.7314 7 20.4V18H3ZM3 18H7H3ZM21 18V20.4C21 20.7314 20.7314 21 20.4 21H17.6C17.2686 21 17 20.7314 17 20.4V18H21ZM21 18H17H21Z"
              stroke="#4D4D4D"
              stroke-width="1.5"
            />
          </Svg>
        );
    }
  }

  return renderIcon();
}

export default CategoryIconSVG;
