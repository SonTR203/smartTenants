import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../ThemeContext";

function TermsAndConditions({ navigation }) {
  const { theme, styleVariables } = useTheme();

  return (
    <View
      style={[
        theme.globalMargins,
        { flex: 1, backgroundColor: styleVariables.colors.white },
      ]}>
      <ScrollView>
        {/* <Text
          style={[
            styleVariables.fontSizes.header,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}
        >
          Lorem Ipsum
        </Text> */}
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          This Privacy Policy has been prepared by Smart Living Properties for
          their rental property Algonquin Place (herein known as "Algonquin
          Place", "we", "us", "our") and sets out the way Smart Living
          Properties collects, discloses, use, and otherwise manages personal
          information. The Privacy Policy also describes the privacy practices
          on the Smart Living Properties and Smart Living Properties website
          (the "website", the "site", or the "websites") and through other
          interactions with consumers.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Collection and Use of Personal Information
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          Guest Registry: When you visit one of our rental offices and complete
          a guest registry form, we collect contact information such as your
          first and last name, mailing address, email address, and personal
          phone numbers. You may also choose to provide optional additional
          information such as your current housing situation, your reasons for
          moving, your desired housing characteristics, family status, age
          group, number of adults and children and your annual household income.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          We only use this information that you have provided on the
          registration to form a better understanding of your needs, aid you in
          finding a suitable rental and to send you tailored communications
          about our properties.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          We also use this information on an aggregator basis to help us better
          understand our tenants and to improve our products and service
          offerings.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Website Registration
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          In order to obtain access to information regarding rentals, vacancies
          or logging maintenance service reports on any password-protected areas
          of our websites, we may request certain personal information such as
          your name, telephone number, mailing address, unit number, email
          address and the corresponding password that you have selected. We use
          this information to provide and administer your online account or
          service your request. Marketing Communications: When you complete and
          submit a registration form, or otherwise sign-up to receive
          information regarding our properties and services, we collect your
          contact information such as your name, phone numbers, mailing
          addresses and email address. We will use this information to send you
          communications based on your expressed interests by mail, email or
          telephone. You may opt-out of receiving all future marketing and
          promotional communications at any time by clicking on the unsubscribe
          link included in our email communications, or by contacting us with
          the credentials noted at the bottom of this Privacy Policy.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Customer Service
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          Any time that you contact us with a comment, complaint or a question,
          you may be asked for information to help us identify yourself (such as
          your name, address, and your telephone number) along with additional
          information we may need to help us promptly answer your question or
          respond to your comment or complaint (e.g: your building, unit number,
          community, etc.) We may retain this information to assist you in the
          future and to improve our customer service. We may additionally use
          personal information to establish and manage our relationship with you
          and provide quality customer service.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Disclosure and Sharing of Your Personal Information
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          We will not under any circumstances disclose, rent, trade, sell or
          otherwise transfer your personal information without your consent,
          except as otherwise outlined herein. Service Providers: Your personal
          information may be transferred (or otherwise made available) to our
          designated third parties or affiliates who provide services on our
          behalf. As an example, we may utilize a service provider for the
          maintenance of our website, including hosting an information form,
          providing additional services related to our site, sending electronic
          mail or other functions related to our business or services provided.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          Our service providers are given only the information they need to
          perform designated functions and are not authorized under any
          circumstances to disclose personal information for their own marketing
          purposes.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          Your personal information may be maintained and processed by us, our
          affiliations and other third-party service providers in Canada, the US
          or other foreign jurisdictions. In the event that personal information
          is transferred to other foreign jurisdictions, it will be subject to
          the laws of that country and may be disclosed to or accessed by their
          respective courts of law (or related parties), local law enforcement
          and governmental authorities in accordance to their laws. Sale of
          Business: Personal information may be provided to third parties in
          connection with a prospective or completed business transaction,
          including a sale or merger (including transfers made as part of
          bankruptcy proceedings or insolvency) involving all or a part of Smart
          Living Properties or as a part of a corporate reorganization or stock
          sale or additional or other changes in corporate control.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Analytics
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          Your personal information may be maintained and processed by us, our
          affiliations and other third-party service providers in Canada, the US
          or other foreign jurisdictions. In the event that personal information
          is transferred to other foreign jurisdictions, it will be subject to
          the laws of that country and may be disclosed to or accessed by their
          respective courts of law (or related parties), local law enforcement
          and governmental authorities in accordance to their laws. Sale of
          Business: Personal information may be provided to third parties in
          connection with a prospective or completed business transaction,
          including a sale or merger (including transfers made as part of
          bankruptcy proceedings or insolvency) involving all or a part of Smart
          Living Properties or as a part of a corporate reorganization or stock
          sale or additional or other changes in corporate control.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Retention and Safeguards
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          We have applied reasonable administrative, technical and physical
          measures in an effort to protect the personal information in our
          custody and control against loss, theft and unauthorized access
          including the usage, modification and disclosure of information. We
          restrict access to your personal information on a need to know basis
          to employees and authorized service providers who need access in order
          to fulfill their job requirements. Your online access to your personal
          information may be protected with a password that you have selected.
          We strongly discourage you from disclosing or sharing your password
          with anyone. We will never prompt you for your password via any
          unsolicited communication (such as phone calls, email, phone calls, or
          social media messaging systems.) Our personal information retention
          processes are meant to retain personal information of our customers
          for no longer than necessary for the purposes stated above or to
          otherwise adhere to legal parameters.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Access to Your Personal Information
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          You retain the right to access, update and correct inaccuracies in
          your personal information that we have in our custody and control.
          This is subject to personal exceptions as prescribed by the law.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          You may request access to update, modify and correct inaccuracies in
          personal information that have in our possession or control by
          emailing, writing us, or calling us through the contact information as
          noted below.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          We may in turn request certain information for verification purposes
          in order to properly identify you as the appropriate person seeking
          access to their personal information records.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Changes to the Privacy Policy
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          This privacy policy may be updated periodically to reflect changes to
          our personal information practices in accordance with the law. We will
          post the updated Privacy Policy on our website; your personal
          information will always be treated in accordance to what is noted
          within the Privacy Policy in place at the time your personal
          information was collected, unless you otherwise consent.
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.secondaryHeader,
            { marginBottom: 20, color: styleVariables.colors.black },
          ]}>
          Contact Us
        </Text>
        <Text
          style={[
            styleVariables.fontSizes.body,
            { marginBottom: 40, color: styleVariables.colors.black },
          ]}>
          If you have any questions about this Privacy Policy, please contact
          us:
          {"\n"}&#x2022; By email:
          {"\n"}&#x2022; By visiting this page on our website:
          https://www.smartlivingproperties.ca
          {"\n"}&#x2022; By phone number: 613-244-1551
          {"\n"}&#x2022; By mail: 226 Argyle Ave,
          {"\n"}Ottawa, ON, K2P 1B9
        </Text>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Signup");
        }}
        style={{
          paddingBottom: 34,
        }}>
        <View
          style={[
            theme.primaryButton,
            {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}>
          <Text
            style={[
              styleVariables.fontSizes.bodyBold,
              theme.primaryButtonText,
            ]}>
            I Understand
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default TermsAndConditions;
