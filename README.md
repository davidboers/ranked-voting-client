This is an Internet browser-based electronic ballot that can be used to cast votes in various ranked-choice elections, including [Instant-Runoff Voting (IRV)](https://en.wikipedia.org/wiki/Instant-runoff_voting) and the [Single Transferable Vote (STV)](https://en.wikipedia.org/wiki/Single_transferable_vote). The ballot uses a drag-and-drop format. Although this format can only be implemented using a digital ballot, it is superior to other designs, because it eliminates miscast ballots.

# Set up

In `index.html`:

```html
<!-- Insert name of election here. -->
<h2 id="electionName">Election Name</h2>
<!-- Insert number of seats here. -->
<span style="display: none" id="seats">4</span>

...

<ol id="candidateList">
  <!-- Insert list of candidates in any order. -->
  <li class="candidate">Bob</li>
  <li class="candidate">George</li>
  ...
</ol>
```

You will also need to create a secure password. This password will allow you to download the list of cast ballots after the election is over. You can use any combination of letters, numbers, and symbols. Users have to manually input passwords, so unless they're Ethan Hunt, you should be fine with a moderately strong password. You can use the `random-password.c` script to generate one. To execute with [GCC](https://gcc.gnu.org/):

```shell
$ gcc random-password.c -o random-password
$ random-password
# Lakgb3yd7Ur9obE8R0iuPuxD8i
```

Next, edit `index.js`.

```javascript
const key = "password"; // Insert generated password here
```

# Election administration

All voters vote on the same device. `index.html` should be open in a web browser. I would recommend Google Chrome, where the client was tested. Put the browser in full screen mode (on Windows, use <kbd>F11</kbd>, and on Mac, <kbd>Ctrl</kbd> + <kbd>⌘</kbd> + <kbd>F</kbd>). Full screen mode prevents someone from hitting "refresh" on the toolbar, which will wipe the client's memory. Voters can use a mouse or touchscreen to manipulate the client. Voters should not have access to a keyboard.

# Voting process

Voters should start the voting process by clicking the `Open Ballot` button. They can then drag-and-drop the name of each candidate so that the list of candidates reflects their preferred ordering. Currently, only ["full-preferential voting"](https://en.wikipedia.org/wiki/Optional_preferential_voting) is supported. The ballot utilizes the [Robson Rotation](https://en.wikipedia.org/wiki/Robson_Rotation), randomly ordering the list of candidates on each ballot to prevent the ordering from influencing the election.

When the voter is done ordering the candidates, they should click the `Submit Vote` button. A popup will ask the voter to confirm they wish to cast their ballot. If the `Open Ballot` button was clicked by mistake, the user can use the `Cancel` option to exit without casting a ballot.

Because the drag-and-drop function prevents miscast ballots, it eliminates the right of the voter to deliberately spoil their ballot in protest. To compensate for this, the client provides an option to cast a blank ballot. Blank ballots are tallied, but do not affect the election. To disable this option, you can insert the following CSS node in the `<style>...</style>` section:

```CSS
#submit-blank {
    display: none;
}
```

# Counting process

When all votes have been cast, the administrator can download the record of cast ballots in `.blt` format. [See here](https://yingtongli.me/git/OpenTally/about/docs/blt-fmt.md). The user can use custom software to count the ballots, or use RunasSudo's [OpenTally](https://yingtongli.me/opentally/). The number of blank ballots appears as a comment at the end of `votes.blt`.

To download `votes.blt`, click the `Administrative Login` button and enter the password. If the password is entered correctly, the file will be received as a download.
