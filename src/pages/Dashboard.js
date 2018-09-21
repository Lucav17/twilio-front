import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ChartBar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {
  mailFolderListItems,
  otherMailFolderListItems
} from "../configs/tiledata";
import Button from "@material-ui/core/Button";
import "../assets/style.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Axios from "axios";
import CONFIG from "../configs/main";
import { getCookie } from "../utils/Session";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import ChatIcon from '@material-ui/icons/Chat'
import RingIcon from '@material-ui/icons/RingVolume'

const drawerWidth = 240;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: getCookie("sessionKey"),
      open: true,
      anchor: "left",
      phone: "+1",
      message: "",
      smsBody: "",
      smsPhone: "+1",
      showSnack: false,
      snackMessage: "",
      loader: false,
      active: 1
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value
    });
  };

  handleChange = (key, val) => {
    this.setState({
      [key]: val
    });
  };

  handleSMSSubmit = () => {
    this.setState({
      loader: true
    });
    console.log(/[~`!#$%\^&*=\-\[\]\\';,/{}|\\":<>\?]/g.test(smsPhone));
    const { smsBody, smsPhone, token } = this.state;
    let issues = [];
    if (!smsPhone.includes("+")) {
      issues.push('Please include the "+" in the phone number.');
    }
    if (smsPhone.length !== 12) {
      issues.push('Make sure phone number is in "+1xxxXXXxxxx" format.');
    }
    if (
      smsPhone.match(/[a-z]/i) ||
      /[~`!#$%\^&*=\-\[\]\\';,/{}|\\":<>\?]/g.test(smsPhone)
    ) {
      issues.push("Only put in standard phone number characters.");
    }
    if (smsBody.length === 0) {
      issues.push("Enter valid message.");
    }
    if (issues.length === 0) {
      const body = {
        body: smsBody,
        phone: smsPhone
      };

      const headers = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      };

      Axios.post(`${CONFIG.BASE_URL}/twilio/sms/one-time`, body, headers).then(
        result => {
          this.setState({
            showSnack: true,
            loader: false,
            snackMessage: "Success!"
          });
        }
      );
    } else {
      this.setState({
        showSnack: true,
        loader: false,
        snackMessage: issues.join("<br />")
      });
    }
  }

  handleSubmit = () => {
    this.setState({
      loader: true
    });
    console.log(/[~`!#$%\^&*=\-\[\]\\';,/{}|\\":<>\?]/g.test(phone));
    const { message, phone, token } = this.state;
    let issues = [];
    if (!phone.includes("+")) {
      issues.push('Please include the "+" in the phone number.');
    }
    if (phone.length !== 12) {
      issues.push('Make sure phone number is in "+1xxxXXXxxxx" format.');
    }
    if (
      phone.match(/[a-z]/i) ||
      /[~`!#$%\^&*=\-\[\]\\';,/{}|\\":<>\?]/g.test(phone)
    ) {
      issues.push("Only put in standard phone number characters.");
    }
    if (message.length === 0) {
      issues.push("Enter valid message.");
    }
    if (issues.length === 0) {
      const body = {
        message,
        phone
      };

      const headers = {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      };

      Axios.post(`${CONFIG.BASE_URL}/twilio/call/one-time`, body, headers).then(
        result => {
          this.setState({
            showSnack: true,
            loader: false,
            snackMessage: "Success!"
          });
        }
      );
    } else {
      this.setState({
        showSnack: true,
        loader: false,
        snackMessage: issues.join("<br />")
      });
    }
  };

  render() {
    const { classes, theme } = this.props;
    const { anchor, open, active } = this.state;
    const vertical = "bottom",
      horizontal = "left";

    const action = (
      <Button
        color="secondary"
        size="small"
        onClick={() => {
          this.handleChange("showSnack", false);
        }}
      >
        Close
      </Button>
    );

    const drawer = <Drawer variant="persistent" anchor={anchor} open={open} classes={{ paper: classes.drawerPaper }}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => { this.setState({ active: 1 }); }}>
            <ListItemIcon>
              <RingIcon />
            </ListItemIcon>
            <ListItemText primary="Call" />
          </ListItem>
          <ListItem button onClick={() => { this.setState({ active: 2 }); }}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="SMS" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>;

    let before = null;
    let after = null;

    if (anchor === "left") {
      before = drawer;
    } else {
      after = drawer;
    }

    if (!this.state.token || this.state.token === undefined) {
      window.location.href = "/";
      return null;
    }

    return <div className={classes.appFrame}>
        <AppBar className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
            [classes[`appBarShift-${anchor}`]]: open
          })}>
          {this.state.loader ? <LinearProgress /> : null}
          <Toolbar disableGutters={!open}>
            <IconButton color="inherit" aria-label="open drawer" onClick={this.handleDrawerOpen} className={classNames(classes.menuButton, open && classes.hide)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Twilio Spam App
            </Typography>
          </Toolbar>
        </AppBar>
        {before}
        <main className={classNames(
            classes.content,
            classes[`content-${anchor}`],
            {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open
            }
          )}>
          <div className={classes.drawerHeader} />
          {active === 1 ? <div>
              <TextField required id="standard-required" label="Phone Number" margin="normal" placeholder="Enter phone number.." className={classes.input} value={this.state.phone} onChange={e => {
                  this.handleChange("phone", e.target.value);
                }} />
              <br /> <br />
              <TextField id="Message" label="Message" multiline rows="3" rowsMax="5" placeholder="Enter message to be said.." className={classes.input} margin="normal" value={this.state.message} onChange={e => {
                  this.handleChange("message", e.target.value);
                }} />
              <Button variant="contained" className="submitButton" onClick={() => {
                  this.handleSubmit();
                }}>
                Submit
              </Button>
            </div> : null}
          {active === 2 ? <div>
              <TextField required id="smsPhone" label="Phone Number" margin="normal" placeholder="Enter phone number.." className={classes.input} value={this.state.smsPhone} onChange={e => {
                  this.handleChange("smsPhone", e.target.value);
                }} />
              <br /> <br />
              <TextField id="smsBody" label="SMS Body" multiline rows="3" rowsMax="5" placeholder="Enter message to be texted.." className={classes.input} margin="normal" value={this.state.smsBody} onChange={e => {
                  this.handleChange("smsBody", e.target.value);
                }} />
              <Button variant="contained" className="submitButton" onClick={() => {
                  this.handleSMSSubmit();
                }}>
                Submit
              </Button>
            </div> : null}
        </main>
        {after}
        <Snackbar anchorOrigin={{ vertical, horizontal }} open={this.state.showSnack} onClose={this.handleClose} message={<span id="message-id" dangerouslySetInnerHTML={{ __html: this.state.snackMessage }} />} action={action} />
      </div>;
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  colorPrimary: {
    backgroundColor: "#B2DFDB"
  },
  barColorPrimary: {
    backgroundColor: "#00695C"
  },
  appBar: {
    position: "absolute",
    backgroundColor: "#7186c7",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  input: {
    width: "100%"
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  "appBarShift-right": {
    marginRight: drawerWidth
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  "content-right": {
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: 0
  },
  "contentShift-right": {
    marginRight: 0
  },
  submitButton: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    backgroundColor: "#333",
    color: "#ccc"
  }
});

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Dashboard);
