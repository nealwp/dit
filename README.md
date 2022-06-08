# Auto MSR
### *An frictionless task logging and reporting tool in NodeJS*
## The Problem(s)
1. At the end of each working day I needed to report 3-4 things I had completed or was working on that day.
1. At the end of the month I needed to compile a simple report of my key accomplishments for that month.

Both of these requirements - while simple in and of themselves - were "computationally expensive" for me in the context of my daily routine. I attempted having a text file or Excel sheet open throughout the day to log my work activities, but found that the context switching involved with these methods put a damper my productivity. So I usually ended up waiting until the very end of the day, and then spending 10-15 minutes thinking of what to write in my report.

The monthly report was an even bigger ordeal. My process consisted of:

1. Going through my "Sent" email folder and copying the text from every daily report for that month into a giant paragraph in a text file.
1. Find-and-Replace every ". " in the text file with a ".\n" to put each sentence on its own line.
1. Sorting all the lines alphabetically. (Thanks for that feature, Notepad++)
1. Removing any duplicate/semi-duplicate lines.
1. Paring down the remaining 30-40 lines to 7-10 "highlights."
1. Copy/pasting the highlight lines to an email, formatting as bulleted list, and sending

All in all, this usually took about half an hour to do.

Altogether, these two tasks would cost me over 3 hours a month on average. (*10 mins daily x 18 working days = 180 minutes + 20 minutes monthly, 1 time a month = 200 minutes = **~3 hours and 20 minutes** *per month.*)

## Solution

I wanted a solution that was always at my fingertips. When I'm working I always have a terminal window open in VS Code to run my `git` and `npm` commands, so having another 3-letter console command would be perfect - no need to even leave my workspace! 

Even better, it would store all those daily entries and spit them back out for me at the end of the month - no more digging through a months worth of sent emails!

## Result
It takes me ~7 seconds to add an entry. On average I do that 3 times per day, so 21 seconds. Getting my end-of-day output and pasting into an email and sending takes ~12 seconds. Daily cost = ~35 seconds (rounding up)

At the end of the month, it takes ~9 seconds to generate my output and paste into an email. The duplicates are already removed, so add another 3 minutes for filtering down to the highlights.

In total, I now spend about **3 minutes and 45 seconds** *per month* on my required reporting, **98.1% less time**. I'm saving 11,656 seconds every month - that's **38.9 hours saved per year.**

# Usage
## Add an Entry
```bash
msr add 'Completed some task'
```
Output:
```bash
[{ rowid: 1 }]
```
## List all Entries
```bash
msr all 
```

Output:
```
[
  {
    rowid: 1,
    description: 'Completed some task',
    date_added: '2022-06-03'
  }
]
```
## Get End-of-Day Report
```bash
msr eod
```
Output: *(this gets added to the clipboard for quick pasting!)*
```
Completed some task. Completed another task. Still working on X task.
```
## Get End-of-Month Report
```bash
msr eom
```
Output: *(this gets added to the clipboard for quick pasting!)*
```
- Completed some task.
- Completed another task.
- Still working on X task.
```
