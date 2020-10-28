class User < ApplicationRecord
    validates_uniqueness_of :username

    def self.generate
        adjectives = ["Ancient", "Broken", "Creative", "Dangerous", "Effective", "Flying", "Giled"]
        nouns = ['Highway', 'Intern', 'Lion', 'Master', 'Bee']
        number = rand.to_s[2..4]
        username = "#{adjectives.sample}-#{nouns.sample}-#{number}"
        
        create(username: username)
    end
end


