import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

const Copyright = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {"Copyright © Bukit Delight By "}
    <Link color="inherit" href="https://www.facebook.com/Alpinnz">
      Alpinnz
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);

export default Copyright;
