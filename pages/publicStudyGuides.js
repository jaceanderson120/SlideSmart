// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */
import "react-circular-progressbar/dist/styles.css";
import SearchBar from "@/components/SearchBar";

const PublicStudyGuides = () => {
  function handleSearch() {
    console.log("Search");
  }
  return <SearchBar onSearch={handleSearch}></SearchBar>;
};

export default PublicStudyGuides;
