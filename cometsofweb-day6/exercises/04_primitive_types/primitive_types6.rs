fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    #[test]
    fn indexing_tuple() {
        let numbers = (1, 2, 3);
        // Replace below ??? with the tuple indexing syntax.
        let second = numbers.1;

        assert_eq!(2, second, "This is not the 2nd number in the tuple!")
    }
}
