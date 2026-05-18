import twitter_icon from "../../assets/footericons/twitter_icon.svg"
import facebook_icon from "../../assets/footericons/facebook_icon.svg"
import github_icon from "../../assets/footericons/github_icon.svg"

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-gray-100 p-10 w-full">
        <aside >
          {/* custom logo */}
          {/* <img src={footerLogo} alt="footer-logo" className="w-15 h-15" /> */}

          <img src="https://i.ibb.co.com/FQtQrZZ/medical-equipment.png" className="size-14" />
          <p className="font-bold">
            MediFlow Co.
            <br />
            Providing reliable tech since 2024.
          </p>


        </aside>
        <nav>
          <div className="grid grid-flow-col gap-10">
            <a target="_blank">
              <img src={twitter_icon} alt="twitter" />
            </a>
            <a target="_blank">
              <img src={facebook_icon} alt="facebook" />
            </a>
            <a href="https://github.com/zaheen4/mediflow-react-app" target="_blank">
              <img src={github_icon} alt="github" />
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;