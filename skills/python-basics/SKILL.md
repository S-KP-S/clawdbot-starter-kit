<!-- Generated from video: https://www.youtube.com/watch?v=rfscVS0vtbw -->
<!-- Generated on: 2026-02-01T20:07:28.799Z -->

# Python Programming - Full Beginner Course

## Summary
A comprehensive introduction to Python programming covering all core concepts from basic syntax to object-oriented programming. This course takes complete beginners through practical projects and real-world applications to build foundational programming skills.

## Prerequisites
- Basic computer literacy
- Ability to download and install software
- No prior programming experience required

## Step-by-Step Instructions

### 1. Setup and Installation
1. Download Python from official website (python.org)
2. Download and install PyCharm IDE
3. Create new Python project in PyCharm
4. Create first Python file with `.py` extension
5. Write `print("Hello World")` and run the program

### 2. Basic Syntax and Drawing
1. Use `print()` function with string literals in quotes
2. Create simple ASCII art using multiple print statements
3. Use escape characters like `\n` for new lines

### 3. Variables and Data Types
1. Create variables using format: `variable_name = value`
2. Learn string variables: `name = "John"`
3. Learn integer variables: `age = 35`
4. Learn float variables: `gpa = 3.5`
5. Learn boolean variables: `is_male = True`

### 4. Working with Strings
1. Use string concatenation with `+` operator
2. Access string functions with dot notation: `string.lower()`
3. Key string methods:
   - `.upper()` - convert to uppercase
   - `.lower()` - convert to lowercase
   - `.isupper()` - check if uppercase
   - `.len()` - get string length
   - `.index("char")` - find character position
   - `.replace("old", "new")` - replace text

### 5. Working with Numbers
1. Perform basic math operations: `+`, `-`, `*`, `/`
2. Use modulus operator `%` for remainders
3. Import math module: `from math import *`
4. Key math functions:
   - `abs()` - absolute value
   - `pow(base, exponent)` - power function
   - `max()` - maximum value
   - `min()` - minimum value
   - `round()` - round numbers
   - `floor()` - round down
   - `ceil()` - round up
   - `sqrt()` - square root

### 6. Getting User Input
1. Use `input("prompt message")` to get user input
2. Convert input types using:
   - `int(input("Enter number: "))` - for integers
   - `float(input("Enter decimal: "))` - for floats

### 7. Building a Basic Calculator
1. Get two numbers from user using `input()`
2. Convert strings to numbers using `int()` or `float()`
3. Perform calculation and store in variable
4. Print result using `print()` function

### 8. Lists
1. Create lists using square brackets: `friends = ["Kevin", "Karen", "Jim"]`
2. Access elements by index: `friends[0]` (first element)
3. Use negative indexing: `friends[-1]` (last element)
4. Modify elements: `friends[1] = "Mike"`

### 9. List Functions
1. Key list methods:
   - `.extend([items])` - add multiple items
   - `.append(item)` - add single item to end
   - `.insert(index, item)` - insert at specific position
   - `.remove(item)` - remove specific item
   - `.clear()` - remove all items
   - `.pop()` - remove last item
   - `.index(item)` - find item position
   - `.count(item)` - count occurrences
   - `.sort()` - sort list
   - `.reverse()` - reverse order

### 10. Tuples
1. Create tuples using parentheses: `coordinates = (4, 5)`
2. Access elements by index: `coordinates[0]`
3. Note: Tuples are immutable (cannot be changed)

### 11. Functions
1. Define function using `def` keyword:
   ```python
   def say_hi():
       print("Hello User")
   ```
2. Call function by name: `say_hi()`
3. Add parameters: `def say_hi(name):`
4. Pass arguments when calling: `say_hi("Mike")`

### 12. Return Statements
1. Use `return` keyword to return values from functions
2. Example:
   ```python
   def cube(num):
       return num * num * num
   ```
3. Store returned value in variable: `result = cube(3)`

### 13. If Statements
1. Basic if statement syntax:
   ```python
   if condition:
       # code to execute
   ```
2. Add else clause:
   ```python
   if condition:
       # code if true
   else:
       # code if false
   ```
3. Use elif for multiple conditions:
   ```python
   if condition1:
       # code
   elif condition2:
       # code
   else:
       # code
   ```

### 14. Comparison Operators
1. Equality: `==` (equal to)
2. Inequality: `!=` (not equal to)
3. Greater than: `>`
4. Less than: `<`
5. Greater than or equal: `>=`
6. Less than or equal: `<=`
7. Logical operators: `and`, `or`, `not`

### 15. Dictionaries
1. Create dictionary with key-value pairs:
   ```python
   monthConversions = {
       "Jan": "January",
       "Feb": "February"
   }
   ```
2. Access values by key: `monthConversions["Jan"]`
3. Use `.get(key, default)` for safe access

### 16. While Loops
1. Basic while loop syntax:
   ```python
   while condition:
       # code to repeat
   ```
2. Update loop variable to avoid infinite loops
3. Example:
   ```python
   i = 1
   while i <= 5:
       print(i)
       i += 1
   ```

### 17. For Loops
1. Loop through string characters:
   ```python
   for letter in "Giraffe Academy":
       print(letter)
   ```
2. Loop through lists:
   ```python
   for friend in friends:
       print(friend)
   ```
3. Loop through ranges:
   ```python
   for index in range(10):
       print(index)
   ```

### 18. File Operations
1. Reading files:
   ```python
   employee_file = open("employees.txt", "r")
   print(employee_file.read())
   employee_file.close()
   ```
2. Writing files:
   ```python
   employee_file = open("employees.txt", "w")
   employee_file.write("Toby - Human Resources")
   employee_file.close()
   ```
3. File modes: "r" (read), "w" (write), "a" (append), "r+" (read and write)

### 19. Error Handling
1. Use try/except blocks:
   ```python
   try:
       # code that might cause error
       number = int(input("Enter a number: "))
   except ValueError:
       print("Invalid input")
   ```

### 20. Classes and Objects
1. Define class:
   ```python
   class Student:
       def __init__(self, name, major, gpa):
           self.name = name
           self.major = major
           self.gpa = gpa
   ```
2. Create objects:
   ```python
   student1 = Student("Jim", "Business", 3.1)
   ```
3. Access attributes: `student1.name`

### 21. Inheritance
1. Create child class:
   ```python
   class Chef:
       def make_chicken(self):
           print("The chef makes chicken")
   
   class ChineseChef(Chef):
       def make_fried_rice(self):
           print("The chef makes fried rice")
   ```

## Key Rules/Guidelines
- Python is case-sensitive
- Indentation matters - use consistent spacing (4 spaces recommended)
- Variables cannot start with numbers
- Use descriptive variable names
- Always close files after opening them
- Functions should have a single, clear purpose
- Use comments to explain complex code

## Common Mistakes
- Forgetting to convert user input from string to appropriate data type
- Using assignment operator `=` instead of equality operator `==` in conditions
- Infinite loops due to not updating loop variables
- Forgetting to close files after opening them
- Incorrect indentation causing IndentationError
- Trying to modify tuples (they are immutable)

## Tips
- Use meaningful variable and function names
- Test code frequently with small examples
- Use PyCharm's syntax highlighting and error detection
- Practice with the provided exercises and projects
- Break complex problems into smaller functions
- Use Python's built-in help() function for documentation
- Install packages using pip when needed for extended functionality